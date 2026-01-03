import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export function NewsletterSection() {
    return (
        <section className="py-20 bg-emerald-900 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[size:1rem_1rem]" />

            <div className="container mx-auto px-4 lg:px-6 relative z-10">
                <div className="bg-emerald-800/50 rounded-3xl p-8 md:p-16 text-center max-w-4xl mx-auto backdrop-blur-sm border border-emerald-700/50">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-700 rounded-2xl mb-8 text-emerald-100">
                        <Mail className="h-8 w-8" />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Join our Growing Community</h2>
                    <p className="text-lg text-emerald-100 mb-10 max-w-2xl mx-auto">
                        Get the latest updates on new land listings, seasonal planting tips, and upcoming workshops directly to your inbox.
                    </p>

                    <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <Input
                            type="email"
                            placeholder="Enter your email address"
                            className="bg-white/10 border-emerald-600/50 text-white placeholder:text-emerald-200/50 focus:border-emerald-400 focus:ring-emerald-400 h-12"
                        />
                        <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50 h-12 px-8 font-semibold">
                            Subscribe
                        </Button>
                    </form>

                    <p className="text-xs text-emerald-300 mt-6">
                        We care about your data in our privacy policy. No spam, ever.
                    </p>
                </div>
            </div>
        </section>
    )
}
