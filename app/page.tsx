import { BenefitsSection } from "@/components/landing/benefits-section"
import { ELearningPreview } from "@/components/landing/e-learning-section"
import { FAQSection } from "@/components/landing/faq-section"
import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { NewsletterSection } from "@/components/landing/newsletter-section"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"
import { SuccessStories } from "@/components/landing/success-stories"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
        <BenefitsSection />
        <SuccessStories />
        <ELearningPreview />
        <FAQSection />
        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  )
}
