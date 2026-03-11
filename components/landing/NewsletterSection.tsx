"use client" // Add this at the top!

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Loader2, CheckCircle2 } from "lucide-react"
import { subscribeToNewsletter } from "@/app/actions/subscribe" // Update this path to your file

export function NewsletterSection() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    async function handleAction(formData: FormData) {
        setStatus("loading");
        const result = await subscribeToNewsletter(formData);
        
        if (result?.success) {
            setStatus("success");
        } else {
            setStatus("error");
            // Reset to idle after 3 seconds so they can try again
            setTimeout(() => setStatus("idle"), 3000);
        }
    }

    return (
        <section className="py-20 bg-emerald-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[size:1rem_1rem]" />

            <div className="container mx-auto px-4 lg:px-6 relative z-10">
                <div className="bg-emerald-800/50 rounded-3xl p-8 md:p-16 text-center max-w-4xl mx-auto backdrop-blur-sm border border-emerald-700/50">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-700 rounded-2xl mb-8 text-emerald-100">
                        {status === "success" ? <CheckCircle2 className="h-8 w-8" /> : <Mail className="h-8 w-8" />}
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        {status === "success" ? "You're on the list!" : "Join our Growing Community"}
                    </h2>
                    
                    <p className="text-lg text-emerald-100 mb-10 max-w-2xl mx-auto">
                        {status === "success" 
                            ? "Thanks for joining! We'll keep you updated on land listings and seasonal tips." 
                            : "Get the latest updates on new land listings, seasonal planting tips, and upcoming workshops."}
                    </p>

                    {status !== "success" && (
                        <form action={handleAction} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <Input
                                name="email" // This name must match the formData.get("email") in your action
                                type="email"
                                required
                                placeholder="Enter your email address"
                                className="bg-white/10 border-emerald-600/50 text-white placeholder:text-emerald-200/50 focus:border-emerald-400 focus:ring-emerald-400 h-12"
                            />
                            <Button 
                                type="submit" 
                                disabled={status === "loading"}
                                size="lg" 
                                className="bg-white text-emerald-900 hover:bg-emerald-50 h-12 px-8 font-semibold"
                            >
                                {status === "loading" ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : "Subscribe"}
                            </Button>
                        </form>
                    )}

                    {status === "error" && (
                        <p className="text-red-400 text-sm mt-4 italic">Something went wrong. Try again?</p>
                    )}

                    <p className="text-xs text-emerald-300 mt-6">
                        We care about your data. No spam, ever.
                    </p>
                </div>
            </div>
        </section>
    )
}