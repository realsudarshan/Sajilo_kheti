"use client";

import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Leaf, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// ── Step 1 Schema ─────────────────────────────────────────────────────────────
const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    // Validation: Must be true
    terms: z.literal(true, {
      message: "You must accept the terms to continue",
    }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character (@, #, $, etc.)"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const otpSchema = z.object({
  code: z.string().min(1, "Verification code is required").length(6, "Code must be 6 digits"),
});

type RegisterValues = z.infer<typeof registerSchema>;
type OtpValues = z.infer<typeof otpSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

function Input({
  label,
  error,
  rightElement,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  rightElement?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        <span className="text-red-500 ml-0.5">*</span>
      </label>
      <div className="relative">
        <input
          {...props}
          className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 ${
            error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
          } ${rightElement ? "pr-10" : ""}`}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      <FieldError message={error} />
    </div>
  );
}

function SSOButton({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
    >
      {icon}
      {label}
    </button>
  );
}

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [step, setStep] = useState<"register" | "verify">("register");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");
  const [ssoLoading, setSsoLoading] = useState<string | null>(null);

  const signUpWithSSO = async (strategy: "oauth_google") => {
    if (!isLoaded) return;
    setSsoLoading(strategy);
    try {
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: any) {
      setServerError(err.errors?.[0]?.message ?? "SSO failed. Try again.");
      setSsoLoading(null);
    }
  };

  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCooldown = useCallback(() => {
    setResendCooldown(60);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => () => { if (cooldownRef.current) clearInterval(cooldownRef.current); }, []);

  const onResend = async () => {
    if (!isLoaded || resendCooldown > 0) return;
    setServerError("");
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      startCooldown();
    } catch (err: any) {
      setServerError(err.errors?.[0]?.message ?? "Failed to resend code.");
    }
  };

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" },
  });

  const otpForm = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
  });

  const onRegister = async (values: RegisterValues) => {
    if (!isLoaded) return;
    setServerError("");
    try {
      await signUp.create({
        firstName: values.firstName,
        lastName: values.lastName,
        emailAddress: values.email,
        password: values.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setStep("verify");
      startCooldown();
    } catch (err: any) {
      setServerError(err.errors?.[0]?.message ?? "Something went wrong. Try again.");
    }
  };

  const onVerify = async (values: OtpValues) => {
    if (!isLoaded) return;
    setServerError("");
    try {
      const result = await signUp.attemptEmailAddressVerification({ code: values.code });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        setServerError("Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      setServerError(err.errors?.[0]?.message ?? "Invalid code. Please try again.");
    }
  };

  if (step === "register") {
    return (
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 mb-3">
            <Leaf className="w-6 h-6 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create account</h2>
          <p className="text-sm text-gray-500 mt-1">Join SajiloKheti and start your farming journey</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 space-y-3 mb-4">
          <SSOButton
            onClick={() => signUpWithSSO("oauth_google")}
            label={ssoLoading === "oauth_google" ? "Redirecting..." : "Continue with Google"}
            icon={<svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>}
          />
          <div className="relative flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
        </div>

        <form onSubmit={registerForm.handleSubmit(onRegister)} className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" placeholder="Hari" {...registerForm.register("firstName")} error={registerForm.formState.errors.firstName?.message} />
            <Input label="Last Name" placeholder="Sharma" {...registerForm.register("lastName")} error={registerForm.formState.errors.lastName?.message} />
          </div>

          <Input label="Email" type="email" placeholder="hari@example.com" {...registerForm.register("email")} error={registerForm.formState.errors.email?.message} />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            {...registerForm.register("password")}
            error={registerForm.formState.errors.password?.message}
            rightElement={
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          <Input
            label="Confirm Password"
            type={showConfirm ? "text" : "password"}
            {...registerForm.register("confirmPassword")}
            error={registerForm.formState.errors.confirmPassword?.message}
            rightElement={
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-gray-400">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          {/* Terms Checkbox */}
          <div className="flex flex-col gap-1 py-1">
            <div className="flex items-center gap-3">
              <input
                id="terms"
                type="checkbox"
                {...registerForm.register("terms")}
                className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
              />
              <label htmlFor="terms" className="text-sm text-gray-500 cursor-pointer">
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="text-emerald-600 font-semibold underline underline-offset-4 decoration-emerald-200">
                  Terms & Conditions
                </Link>
              </label>
            </div>
            {registerForm.formState.errors.terms && <p className="text-xs text-red-500 pl-8">{registerForm.formState.errors.terms.message}</p>}
          </div>

          {serverError && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{serverError}</div>}

          {/* Clerk Bot Detection (Captcha) mount point */}
          <div id="clerk-captcha" />

          <button type="submit" disabled={registerForm.formState.isSubmitting} className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-2.5 transition-colors">
            {registerForm.formState.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Continue
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">Sign in</Link>
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 mb-3">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-emerald-600" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
        <p className="text-sm text-gray-500 mt-1">We sent a 6-digit verification code to your email.</p>
      </div>

      <form onSubmit={otpForm.handleSubmit(onVerify)} className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 space-y-4">
        <Input label="Verification Code" placeholder="123456" maxLength={6} {...otpForm.register("code")} error={otpForm.formState.errors.code?.message} />
        {serverError && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{serverError}</div>}
        <button type="submit" disabled={otpForm.formState.isSubmitting} className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-2.5 transition-colors">
          {otpForm.formState.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Verify & Create Account
        </button>
        <div className="flex items-center justify-center gap-1.5 text-sm">
          <span className="text-gray-500">Didn&apos;t receive a code?</span>
          <button type="button" onClick={onResend} disabled={resendCooldown > 0} className="font-medium text-emerald-600 hover:text-emerald-700 disabled:text-gray-400">
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
          </button>
        </div>
        <button type="button" onClick={() => setStep("register")} className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors">← Go back</button>
      </form>
    </div>
  );
}