"use client";

import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Leaf, Loader2, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// ── Schema ────────────────────────────────────────────────────────────────────
const resetPasswordSchema = z.object({
    code: z.string()
        .min(1, "Verification code is required")
        .length(6, "Code must be 6 digits"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

// ── Field Error Helper ────────────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="mt-1 text-xs text-red-500 font-medium">{message}</p>;
}

// ── Input Component ───────────────────────────────────────────────────────────
function Input({
    label,
    error,
    rightElement,
    helperText,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
    rightElement?: React.ReactNode;
    helperText?: string;
}) {
    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <div className="relative">
                <input
                    {...props}
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
                        } ${rightElement ? "pr-10" : ""}`}
                />
                {rightElement && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {rightElement}
                    </div>
                )}
            </div>
            <FieldError message={error} />
            {helperText && !error && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
        </div>
    );
}

// ── Password Requirements Checker ──────────────────────────────────────────────
function PasswordRequirements({ password }: { password: string }) {
    const requirements = [
        { label: "At least 8 characters", met: password.length >= 8 },
        { label: "One uppercase letter", met: /[A-Z]/.test(password) },
        { label: "One lowercase letter", met: /[a-z]/.test(password) },
        { label: "One number", met: /[0-9]/.test(password) },
    ];

    return (
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-2">
            {requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${req.met ? "bg-emerald-100" : "bg-gray-200"}`}>
                        {req.met && <Check className="w-3 h-3 text-emerald-600" />}
                    </div>
                    <span className={req.met ? "text-emerald-700 font-medium" : "text-gray-600"}>
                        {req.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ResetPasswordPage() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [serverError, setServerError] = useState("");
    const [resetSuccess, setResetSuccess] = useState(false);

    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { code: "", password: "", confirmPassword: "" },
        mode: "onChange",
    });

    const password = form.watch("password");

    const onSubmit = async (values: ResetPasswordValues) => {
        if (!isLoaded || !signIn) return;
        setServerError("");

        try {
            // STEP 1: Verify the code first
            const result = await signIn.attemptFirstFactor({
                strategy: "email_code",
                code: values.code,
            });

            // STEP 2: Check if the status allows for a password reset
            // Clerk usually transitions to 'needs_new_password'
            if (result.status === "needs_new_password" || result.status === "needs_first_factor") {
                const resetResult = await signIn.resetPassword({
                    password: values.password,
                });

                if (resetResult.status === "complete") {
                    // STEP 3: Log them in immediately
                    await setActive({ session: resetResult.createdSessionId });
                    setResetSuccess(true);
                    setTimeout(() => router.push("/"), 2500);
                }
            } else if (result.status === "complete") {
                // If by some chance it completes early
                await setActive({ session: result.createdSessionId });
                setResetSuccess(true);
                setTimeout(() => router.push("/"), 2500);
            } else {
                setServerError("Unexpected sign-in status: " + result.status);
            }
        } catch (err: any) {
            console.error("Clerk Reset Error:", err);
            const errorMessage = err.errors?.[0]?.longMessage || "Invalid code or password requirements not met.";
            setServerError(errorMessage);
        }
    };

    if (resetSuccess) {
        return (
            <div className="w-full max-w-md mx-auto p-4 flex flex-col items-center justify-center min-h-[400px]">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                        <Check className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Password Reset!</h2>
                    <p className="text-sm text-gray-500 mt-2">
                        Logging you in with your new credentials...
                    </p>
                </div>
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto p-4">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 mb-3">
                    <Leaf className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">New Password</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Please provide the 6-digit code and your new password
                </p>
            </div>

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6 space-y-5"
            >
                <Input
                    label="Verification Code"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    {...form.register("code")}
                    error={form.formState.errors.code?.message}
                />

                <div className="space-y-4">
                    <Input
                        label="New Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...form.register("password")}
                        error={form.formState.errors.password?.message}
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        }
                    />

                    {password && <PasswordRequirements password={password} />}

                    <Input
                        label="Confirm New Password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...form.register("confirmPassword")}
                        error={form.formState.errors.confirmPassword?.message}
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        }
                    />
                </div>

                {serverError && (
                    <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                        {serverError}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={form.formState.isSubmitting || !form.formState.isValid}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 transition-all active:scale-[0.98]"
                >
                    {form.formState.isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        "Reset Password"
                    )}
                </button>

                <div className="pt-2 text-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Back to sign in
                    </Link>
                </div>
            </form>
        </div>
    );
}