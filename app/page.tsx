import { BenefitsSection } from "@/components/landing/BenefitsSection"
import { ELearningPreview } from "@/components/landing/ELearningPreview"
import { FAQSection } from "@/components/landing/FAQSection"
import { HeroSection } from "@/components/landing/HeroSection"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { NewsletterSection } from "@/components/landing/NewsletterSection"
import { SiteFooter } from "@/components/landing/SiteFooter"
import { SiteHeader } from "@/components/landing/SiteHeader"
import { SuccessStories } from "@/components/landing/SuccessStories"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { getWeeklyLeases } from "./admin/analytics/posthog.server"

export default async function Home() {
  const weeklyLeases = await getWeeklyLeases()

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
        <BenefitsSection />
        <SuccessStories />
        <div className="container mx-auto px-4 lg:px-6 py-12">
          <ChartAreaInteractive weeklyLeases={weeklyLeases} />
        </div>
        <ELearningPreview />
        <FAQSection />
        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  )
}
