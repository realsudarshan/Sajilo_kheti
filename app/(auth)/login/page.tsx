"use client";

import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Leaf, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// ── Schema ────────────────────────────────────────────────────────────────────
const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

// ── Field Error Helper ────────────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

// ── Input Component ───────────────────────────────────────────────────────────
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
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function LoginPage() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [ssoLoading, setSsoLoading] = useState(false);

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    // ── Google SSO ────────────────────────────────────────────────────────────
const signInWithGoogle = async () => {
    if (!isLoaded) return;

    // 1. Prepare the UI
    setSsoLoading(true);
    setServerError(null); // Clear the "old" error from the previous click
    
    try {
        await signIn.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/dashboard",
            
            oidcPrompt: "select_account", 
        });
    } catch (err: unknown) {
        // 2. Only if THIS attempt fails, show a NEW error
        const clerkError = err as { errors?: { message: string }[] };
        setServerError(clerkError.errors?.[0]?.message ?? "Google sign-in failed.");
        setSsoLoading(false);
    }
};
    // ── Email + Password ──────────────────────────────────────────────────────
    const onSubmit = async (values: LoginValues) => {
        if (!isLoaded) return;
        setServerError("");

        try {
            const result = await signIn.create({
                identifier: values.email,
                password: values.password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                router.push("/dashboard");
            } else {
                setServerError("Sign-in incomplete. Please try again.");
            }
        } catch (err: unknown) {
            const clerkError = err as { errors?: { message: string }[] };
            setServerError(
                clerkError.errors?.[0]?.message ?? "Invalid email or password."
            );
        }
    };

    return (
        <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 mb-3">
                    <Leaf className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Sign in to your SajiloKheti account
                </p>
            </div>

            {/* Google SSO */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 space-y-4 mb-4">
                <button
                    type="button"
                    onClick={signInWithGoogle}
                    disabled={ssoLoading}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:border-emerald-400 hover:bg-emerald-50 disabled:opacity-60 transition-colors"
                >
                    {ssoLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    ) : (
                        <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                    )}
                    {ssoLoading ? "Redirecting..." : "Continue with Google"}
                </button>

                {/* Divider */}
                <div className="relative flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400 font-medium">OR</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>
            </div>

            {/* Email / Password Form */}
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 space-y-4"
            >
                <Input
                    label="Email"
                    type="email"
                    placeholder="hari@example.com"
                    autoComplete="email"
                    {...form.register("email")}
                    error={form.formState.errors.email?.message}
                />

                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <Link
                            href="/forgot-password"
                            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            {...form.register("password")}
                            className={`w-full rounded-xl border pr-10 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 ${form.formState.errors.password
                                    ? "border-red-400 bg-red-50"
                                    : "border-gray-200 bg-white"
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((p) => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    <FieldError message={form.formState.errors.password?.message} />
                </div>

                {serverError && (
                    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                        {serverError}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-2.5 transition-colors"
                >
                    {form.formState.isSubmitting && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    Sign in
                </button>

                <p className="text-center text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/sign-up"
                        className="text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                        Create account
                    </Link>
                </p>
            </form>
        </div>
    );
}
