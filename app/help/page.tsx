"use client";

import Link from "next/link";
import { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  MessageSquare,
  FileText,
  CreditCard,
  MapPin,
  User,
  Shield,
  Smartphone,
  Clock,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  AlertTriangle,
  Star,
  Building2,
  Navigation,
  Landmark,
} from "lucide-react";

const faqs = [
  {
    category: "Account & Registration",
    icon: <User className="h-5 w-5" />,
    color: "emerald",
    questions: [
      {
        q: "How do I create an account on SajiloKheti?",
        a: "Visit sajilokheti.com and click 'Get Started'. Enter your name, email, and password, or sign up with Google. After verifying your email, your account is ready. New accounts start with the 'Leaser' role (farmer). To become a Landowner, complete KYC verification.",
      },
      {
        q: "I didn't receive the email verification link. What should I do?",
        a: "Check your Spam or Junk folder first. If it's not there, go back to the login page and click 'Resend Verification Email'. Make sure you entered the correct email. If problems persist, contact support@sajilokheti.com.",
      },
      {
        q: "Can I use SajiloKheti without verifying my identity (KYC)?",
        a: "Yes — you can browse listings, search for land, and send applications without KYC. However, to LIST land for lease, you must complete KYC verification and be approved as a Landowner.",
      },
      {
        q: "How long does KYC verification take?",
        a: "Our admin team reviews KYC submissions within 1–3 business days. You'll receive an email notification when your KYC is approved or rejected. If rejected, you'll receive the reason and can resubmit with corrected documents.",
      },
      {
        q: "What documents do I need for KYC?",
        a: "You need: (1) Your Nepali Citizenship Certificate (नागरिकता प्रमाण पत्र) — a clear photo of the front and back. Optionally, a selfie holding the document speeds up review. Make sure the text is readable and the image is well-lit.",
      },
      {
        q: "I forgot my password. How do I reset it?",
        a: "Click 'Forgot Password' on the login page. Enter your registered email and we'll send a reset code. Enter the code to set a new password. If you signed up with Google, you'll need to use 'Continue with Google' instead.",
      },
    ],
  },
  {
    category: "Finding & Applying for Land",
    icon: <MapPin className="h-5 w-5" />,
    color: "blue",
    questions: [
      {
        q: "How do I search for land near me?",
        a: "Go to your Leaser Dashboard and click 'Find Land'. You can filter by location (district, VDC, area), price range, land size, and type. Enable your browser's location permission to see distance from you.",
      },
      {
        q: "How do I send a lease application?",
        a: "Open any land listing, click 'Apply for This Land', and fill out your farming plans, proposed monthly rent, and desired lease duration. Review your application and submit. The landowner will be notified and can accept or reject.",
      },
      {
        q: "Can I apply for multiple land listings at once?",
        a: "Yes, you can apply for multiple listings. However, if one is accepted and you make payment, the others remain open until you withdraw them. We recommend focusing on listings you're serious about.",
      },
      {
        q: "Why was my application rejected by the landowner?",
        a: "Landowners make their own decisions about tenants. Common reasons include: low proposed rent, farming plans that don't match the land type, or the landowner choosing a different applicant. You can apply for other listings freely.",
      },
      {
        q: "How long does a landowner have to respond to my application?",
        a: "There is no fixed deadline for landowners to respond. We recommend reaching out through the platform's contact feature if you haven't heard back after a week. Landowners who are inactive for 30+ days may have their listings reviewed by admin.",
      },
    ],
  },
  {
    category: "Payments & Escrow",
    icon: <CreditCard className="h-5 w-5" />,
    color: "violet",
    questions: [
      {
        q: "How does the escrow payment system work?",
        a: "When your application is accepted, you pay the lease amount to SajiloKheti — not directly to the landowner. We hold the funds securely in escrow. The money is only released to the landowner AFTER both parties sign the Malpot agreement and admin approves it.",
      },
      {
        q: "What payment methods are accepted?",
        a: "We accept eSewa, Khalti, and bank transfers (NABIL, NIC Asia, Global IME, and most major Nepali banks). Cash payments at partner Malpot offices are also possible but require manual confirmation.",
      },
      {
        q: "What is the platform service fee?",
        a: "SajiloKheti charges a 2.5% service fee on each successful transaction. This fee is deducted from the escrow amount before releasing payment to the landowner. There are no additional hidden charges.",
      },
      {
        q: "What happens to my money if the deal falls through?",
        a: "If the Malpot agreement is rejected by admin due to document issues, or if either party cancels before the agreement is submitted, your funds are fully refunded. Refunds take 3–7 business days depending on your payment method.",
      },
      {
        q: "I made a payment but the chat didn't unlock. What do I do?",
        a: "Payment confirmation can take a few minutes. Refresh your dashboard. If the chat is still locked after 30 minutes, contact support@sajilokheti.com with your payment receipt and lease ID. We'll resolve it within 24 hours.",
      },
      {
        q: "How do I view my transaction history?",
        a: "Go to your Dashboard → 'Transactions' or 'Payment History'. All payments, receipts, and refunds are listed with dates and amounts. You can also download receipts as PDF.",
      },
    ],
  },
  {
    category: "Chat Feature",
    icon: <MessageSquare className="h-5 w-5" />,
    color: "teal",
    questions: [
      {
        q: "When does the chat feature unlock?",
        a: "The chat between Landowner and Leaser unlocks automatically after the Leaser's payment is confirmed and received by the escrow system. Both parties will see a notification and a 'Chat' button on their lease detail page.",
      },
      {
        q: "What can I do in the chat?",
        a: "You can: send text messages, share photos and documents (up to 25MB), coordinate land visit times, discuss Malpot Karyalaya visit logistics, and clarify any lease details.",
      },
      {
        q: "Are my chat messages private?",
        a: "Chats are private between the two parties involved in the lease. However, SajiloKheti retains message logs for dispute resolution and safety purposes. Admin can review chats if a dispute is filed.",
      },
      {
        q: "I'm being harassed in chat. What should I do?",
        a: "Use the 'Report' button within the chat to flag messages. You can also file a formal complaint at the Report & Suggest page. We take harassment seriously — violations can result in immediate account suspension.",
      },
    ],
  },
  {
    category: "Navigation & Maps",
    icon: <Navigation className="h-5 w-5" />,
    color: "indigo",
    questions: [
      {
        q: "How do I navigate to the leased land?",
        a: "Open the active lease in your dashboard. Click 'View on Map' or 'Navigate to Land'. This opens a Google Maps view with a GPS pin on the land's exact location. Grant location permission for turn-by-turn directions.",
      },
      {
        q: "How do I find the nearest Malpot Karyalaya?",
        a: "In the lease detail page, click 'Find Nearest Malpot Karyalaya'. SajiloKheti shows the Malpot office with jurisdiction over the leased land. Click 'Get Directions' for Google Maps navigation.",
      },
      {
        q: "The Google Maps location of the land looks wrong. What do I do?",
        a: "Contact the Landowner via chat to confirm the correct location. If the issue persists, report it using the 'Report an Issue' option on the listing page. Admin will investigate and correct the GPS pin if needed.",
      },
      {
        q: "I don't have internet access when visiting the land. What should I do?",
        a: "We recommend downloading the area map offline in Google Maps before your visit. Take a screenshot of the map with the GPS pin. You can also share the pin with your phone's Maps app for offline navigation.",
      },
    ],
  },
  {
    category: "Malpot Agreement",
    icon: <Landmark className="h-5 w-5" />,
    color: "amber",
    questions: [
      {
        q: "What is a Malpot agreement and why is it needed?",
        a: "A Malpot agreement (मालपोत सम्झौता) is an official land lease document registered at the government Land Revenue Office. It legally binds the lease and is required by SajiloKheti before releasing payment to the landowner.",
      },
      {
        q: "Who needs to be present at the Malpot Karyalaya?",
        a: "Both the Landowner and Leaser must be physically present to sign. If one party cannot attend, they must provide a notarized Power of Attorney (मुख्तियारनामा) to their representative.",
      },
      {
        q: "What documents should I bring to the Malpot office?",
        a: "Bring: (1) Your original Citizenship Certificate, (2) Land ownership documents (Landowner only), (3) A copy of the SajiloKheti lease agreement printout, (4) Payment receipt from the platform, (5) 2 passport-size photos each.",
      },
      {
        q: "How do I upload the signed agreement to SajiloKheti?",
        a: "After signing at the Malpot office, scan or photograph the document clearly. Go to your Dashboard → active lease → 'Upload Malpot Agreement'. Select your file (PDF, JPG, or PNG, max 20MB) and submit. Admin will review within 1–3 business days.",
      },
      {
        q: "My Malpot agreement was rejected by admin. What should I do?",
        a: "You'll receive an email with the specific reason for rejection (blurry image, missing signature, etc.). Correct the issue — you may need to visit the Malpot office again for a new stamped copy — and re-upload. Contact support if you need help.",
      },
      {
        q: "When will the landowner receive payment?",
        a: "Payment is released within 1–2 business days after admin approves the uploaded Malpot agreement. Both parties receive an email confirmation. The landowner's registered eSewa/Khalti account or bank receives the funds directly.",
      },
    ],
  },
];

const colorClasses: Record<string, { border: string; bg: string; text: string; icon: string }> = {
  emerald: { border: "border-emerald-200", bg: "bg-emerald-50", text: "text-emerald-700", icon: "bg-emerald-100 text-emerald-600" },
  blue: { border: "border-blue-200", bg: "bg-blue-50", text: "text-blue-700", icon: "bg-blue-100 text-blue-600" },
  violet: { border: "border-violet-200", bg: "bg-violet-50", text: "text-violet-700", icon: "bg-violet-100 text-violet-600" },
  teal: { border: "border-teal-200", bg: "bg-teal-50", text: "text-teal-700", icon: "bg-teal-100 text-teal-600" },
  indigo: { border: "border-indigo-200", bg: "bg-indigo-50", text: "text-indigo-700", icon: "bg-indigo-100 text-indigo-600" },
  amber: { border: "border-amber-200", bg: "bg-amber-50", text: "text-amber-700", icon: "bg-amber-100 text-amber-600" },
};

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden transition-all ${open ? "shadow-sm" : ""}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className={`font-medium text-gray-800 leading-snug ${open ? "text-emerald-700" : ""}`}>{q}</span>
        {open ? <ChevronUp className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" /> : <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />}
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3 bg-gray-50/50">
          {a}
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = faqs.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (faq) =>
        faq.q.toLowerCase().includes(search.toLowerCase()) ||
        faq.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.questions.length > 0 && (activeCategory === null || activeCategory === cat.category));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-emerald-600">🌱 SajiloKheti</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link href="/docs" className="hover:text-emerald-600 transition-colors">Documentation</Link>
            <Link href="/report" className="hover:text-emerald-600 transition-colors">Report / Suggest</Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-600 to-emerald-600 py-14 px-4 text-white text-center">
        <HelpCircle className="h-10 w-10 mx-auto mb-3 opacity-90" />
        <h1 className="text-3xl font-bold mb-2">Help Center</h1>
        <p className="text-emerald-100 text-lg mb-7 max-w-xl mx-auto">
          Find answers to common questions about using SajiloKheti — from registration to releasing payments.
        </p>
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your question..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 shadow-md"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Process Steps */}
        {!search && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-5 text-center">How SajiloKheti Works — Step by Step</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {[
                { icon: "📝", label: "Register", sub: "Create account" },
                { icon: "🪪", label: "KYC (Owner)", sub: "If listing land" },
                { icon: "🔍", label: "Find Land", sub: "Browse listings" },
                { icon: "📋", label: "Apply", sub: "Send application" },
                { icon: "💳", label: "Pay", sub: "Escrow payment" },
                { icon: "💬", label: "Chat & Navigate", sub: "Coordinate visit" },
                { icon: "📄", label: "Malpot", sub: "Sign & upload" },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <span className="text-2xl mb-1">{step.icon}</span>
                  <span className="text-xs font-bold text-gray-800">{step.label}</span>
                  <span className="text-[10px] text-gray-500">{step.sub}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        {!search && (
          <div className="flex flex-wrap gap-2 mb-7">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${activeCategory === null ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"}`}
            >
              All Topics
            </button>
            {faqs.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${activeCategory === cat.category ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"}`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        )}

        {/* FAQ Sections */}
        <div className="space-y-8">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <HelpCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium">No results found for "{search}"</p>
              <p className="text-sm mt-1">Try different keywords or <Link href="/report" className="text-emerald-600 hover:underline">contact support</Link></p>
            </div>
          )}
          {filtered.map((cat) => {
            const c = colorClasses[cat.color];
            return (
              <div key={cat.category}>
                <div className={`flex items-center gap-3 mb-4`}>
                  <div className={`p-2 rounded-xl ${c.icon}`}>{cat.icon}</div>
                  <h2 className="text-lg font-bold text-gray-900">{cat.category}</h2>
                  <span className="text-xs text-gray-400 font-medium ml-auto">{cat.questions.length} questions</span>
                </div>
                <div className="space-y-2">
                  {cat.questions.map((faq, i) => (
                    <FAQItem key={i} q={faq.q} a={faq.a} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Support */}
        <div className="mt-14 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
            <h3 className="text-xl font-bold mb-1">Still need help?</h3>
            <p className="text-emerald-100 text-sm">Our support team is available Sunday–Friday, 10am–6pm NPT.</p>
          </div>
          <div className="p-6 grid md:grid-cols-3 gap-4">
            <a href="mailto:support@sajilokheti.com" className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all group">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Email Support</p>
                <p className="text-xs text-gray-500">support@sajilokheti.com</p>
              </div>
            </a>
            <a href="tel:+977-01-4XXXXXX" className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Phone Support</p>
                <p className="text-xs text-gray-500">+977-01-4XXXXXX</p>
              </div>
            </a>
            <Link href="/report" className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-all group">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-600 group-hover:scale-110 transition-transform">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">File a Report</p>
                <p className="text-xs text-gray-500">Complaints & suggestions</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Doc links */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/docs" className="flex items-center gap-2 text-emerald-600 hover:underline text-sm font-medium">
            <FileText className="h-4 w-4" /> Full Documentation <ArrowRight className="h-3 w-3" />
          </Link>
          <Link href="/terms" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium">
            <Shield className="h-4 w-4" /> Terms & Conditions
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12 py-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} SajiloKheti. All rights reserved. &nbsp;·&nbsp;
          <Link href="/docs" className="hover:text-emerald-600">Documentation</Link> &nbsp;·&nbsp;
          <Link href="/terms" className="hover:text-emerald-600">Terms & Conditions</Link> &nbsp;·&nbsp;
          <Link href="/report" className="hover:text-emerald-600">Report / Suggest</Link>
        </p>
      </footer>
    </div>
  );
}