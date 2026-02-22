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
const forgotPasswordSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

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
export default function ForgotPasswordPage() {
    const { isLoaded, signIn } = useSignIn();
    const router = useRouter();

    const [serverError, setServerError] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [sentEmail, setSentEmail] = useState("");

    const form = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    // ── Handle Password Reset Request ──────────────────────────────────────
    const onSubmit = async (values: ForgotPasswordValues) => {
        if (!isLoaded || !signIn) return;
        setServerError("");

        try {
            // Create a new sign-in attempt for password reset
            const result = await signIn.create({
                strategy: "email_code",
                identifier: values.email,
            });

            // Check if the code was sent successfully
            if (result.supportedFirstFactors?.some(factor => factor.strategy === "email_code")) {
                setSentEmail(values.email);
                setEmailSent(true);
            } else {
                setServerError("Password reset is not available for this email. Please try again.");
            }
        } catch (err: unknown) {
            const clerkError = err as { errors?: { message: string }[] };
            console.error("Password reset error:", err);
            setServerError(
                clerkError.errors?.[0]?.message ?? "Failed to send password reset email. Please try again."
            );
        }
    };

    if (emailSent) {
        return (
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 mb-3">
                        <Leaf className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        We sent a verification code to {sentEmail}
                    </p>
                </div>

                {/* Message Box */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 space-y-4">
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
                        <p className="font-medium mb-1">Password reset link sent!</p>
                        <p>Click the link in the email or enter the verification code on the next page.</p>
                    </div>

                    <button
                        onClick={() => router.push("/reset-password")}
                        className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 transition-colors"
                    >
                        Enter verification code
                    </button>

                    <button
                        onClick={() => {
                            setEmailSent(false);
                            form.reset();
                        }}
                        className="w-full rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2.5 transition-colors"
                    >
                        Use a different email
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Remember your password?{" "}
                        <Link
                            href="/login"
                            className="text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 mb-3">
                    <Leaf className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Reset password</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Enter your email and we&apos;ll send you a password reset link
                </p>
            </div>

            {/* Form */}
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
                    Send reset link
                </button>

                <p className="text-center text-sm text-gray-500">
                    Remember your password?{" "}
                    <Link
                        href="/login"
                        className="text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                        Sign in
                    </Link>
                </p>
            </form>
        </div>
    );
}
