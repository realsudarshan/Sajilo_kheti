"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Shield,
  ChevronRight,
  ChevronDown,
  FileText,
  AlertTriangle,
  CreditCard,
  User,
  MessageSquare,
  MapPin,
  Gavel,
  RefreshCw,
  Mail,
  CheckCircle2,
  Lock,
  Building2,
} from "lucide-react";

const lastUpdated = "March 1, 2025";

const clauses = [
  {
    id: "acceptance",
    icon: <CheckCircle2 className="h-5 w-5" />,
    title: "1. Acceptance of Terms",
    content: `By accessing or using SajiloKheti ("the Platform," "we," "us," or "our") at sajilokheti.com, including its mobile applications and associated services, you ("User," "you," or "your") agree to be legally bound by these Terms and Conditions ("Terms"). 

If you do not agree with any part of these Terms, you must immediately discontinue use of the Platform.

These Terms apply to all users of the Platform, including Landowners, Land Leasers (Farmers), and visitors. Use of the Platform constitutes your acknowledgment that:

(a) You are at least 18 years of age or have legal guardian consent;
(b) You have the legal capacity to enter into contracts under the laws of Nepal;
(c) Your use of the Platform complies with all applicable local, national, and international laws.

SajiloKheti reserves the right to modify these Terms at any time. Changes will be notified via email or a prominent notice on the Platform. Continued use after changes take effect constitutes acceptance of the revised Terms.`,
  },
  {
    id: "accounts",
    icon: <User className="h-5 w-5" />,
    title: "2. User Accounts & Registration",
    content: `**2.1 Account Creation**
To access the full features of SajiloKheti, you must create an account by providing accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials.

**2.2 Account Roles**
SajiloKheti operates with two distinct user roles:
- **Land Leaser (Farmer/Tenant):** Default role for all new accounts. Can browse, apply for land, make payments, and participate in the lease process.
- **Land Owner:** Requires completion of KYC (Know Your Customer) verification. Can list land, review applications, and receive lease payments.

**2.3 KYC Verification Requirements**
To become a verified Landowner, you must:
(a) Submit a valid Nepali Citizenship Certificate (नागरिकता प्रमाण पत्र);
(b) Provide a selfie holding the document (recommended);
(c) Enter your citizenship number accurately;
(d) Ensure all information matches government records.

Submitting false or fraudulent KYC documents is a criminal offense under Nepali law and may result in immediate account termination and referral to law enforcement.

**2.4 Account Security**
You are solely responsible for all activities that occur under your account. You must immediately notify SajiloKheti of any unauthorized use at support@sajilokheti.com.

**2.5 Account Termination**
SajiloKheti reserves the right to suspend or terminate accounts that:
(a) Violate these Terms;
(b) Engage in fraudulent or illegal activity;
(c) Have been inactive for more than 12 months with no active leases.`,
  },
  {
    id: "land-listings",
    icon: <MapPin className="h-5 w-5" />,
    title: "3. Land Listings & Applications",
    content: `**3.1 Listing Requirements**
Landowners listing land on SajiloKheti represent and warrant that:
(a) They are the legal owner or authorized representative of the listed land;
(b) The land is legally available for lease under Nepali law;
(c) All information provided (location, size, price, photos) is accurate and not misleading;
(d) The land is free of any disputes, illegal encumbrances, or court orders preventing lease;
(e) GPS coordinates provided represent the actual location of the land.

**3.2 Prohibited Listings**
The following types of land listings are strictly prohibited:
- Land under litigation or legal dispute
- Land with unclear ownership documentation
- Land in protected areas (forests, conservation zones) without required permits
- Agricultural land designated for non-farming purposes under local laws
- Listings with intentionally false location information

**3.3 Lease Applications**
When submitting a lease application, Leasers agree to:
(a) Provide honest and accurate farming plans;
(b) Propose a fair rent in good faith;
(c) Only apply for land they genuinely intend to farm;
(d) Not submit applications for the purpose of gathering landowner information.

**3.4 Application Acceptance**
The Landowner has full discretion to accept or reject any application. SajiloKheti does not guarantee that any application will be accepted.

**3.5 Single Acceptance Policy**
Once a Landowner accepts one application for a land listing, that listing is temporarily closed. All other pending applications are notified of this status.`,
  },
  {
    id: "payments",
    icon: <CreditCard className="h-5 w-5" />,
    title: "4. Payments, Escrow & Fees",
    content: `**4.1 Escrow System**
SajiloKheti uses a third-party-secured escrow system for all lease payments. When a Leaser makes a payment:
(a) Funds are held securely by SajiloKheti — not transferred to the Landowner;
(b) The Landowner cannot access funds until conditions are met;
(c) The Leaser's funds are protected against fraud.

**4.2 Payment Release Conditions**
Escrow funds are released to the Landowner ONLY when:
(a) A valid, signed Malpot agreement is uploaded by either party;
(b) The agreement is reviewed and approved by SajiloKheti Admin;
(c) All platform conditions are satisfied.

**4.3 Platform Service Fee**
SajiloKheti charges a service fee of 2.5% of the total lease payment. This fee:
(a) Is deducted from the escrow amount before releasing to the Landowner;
(b) Covers platform maintenance, payment processing, and admin services;
(c) Is non-refundable once funds are released.

**4.4 Refund Policy**
Refunds are processed in the following scenarios:
- Admin rejects the Malpot agreement due to document issues: Full refund within 5–7 business days
- Lease cancelled before payment confirmation: Full refund within 3–5 business days
- Technical payment failure: Full refund within 3–5 business days
- Fraud confirmed by admin: Full refund within 7–10 business days

**4.5 Payment Methods**
SajiloKheti accepts: eSewa, Khalti, and bank transfers from registered Nepali banks. International payment methods are not currently supported.

**4.6 Currency**
All transactions on SajiloKheti are conducted in Nepali Rupees (NPR).

**4.7 Tax Obligations**
Users are solely responsible for any applicable taxes (income tax, VAT, land tax) related to their lease transactions. SajiloKheti does not provide tax advice.`,
  },
  {
    id: "chat",
    icon: <MessageSquare className="h-5 w-5" />,
    title: "5. Chat & Communication",
    content: `**5.1 Chat Availability**
The in-platform chat feature is unlocked exclusively after a Leaser's payment has been confirmed in escrow. Chat is not available before this point.

**5.2 Permitted Use**
Users may use chat for:
(a) Coordinating land visits and logistics;
(b) Discussing Malpot Karyalaya visit arrangements;
(c) Sharing relevant documents related to the lease;
(d) Clarifying lease terms.

**5.3 Prohibited Communication**
The following are strictly prohibited in the chat:
(a) Requesting payments outside the SajiloKheti platform;
(b) Sharing banking PINs, passwords, or sensitive financial information;
(c) Harassment, threats, abusive language, or discriminatory content;
(d) Sharing illegal content or links to malicious websites;
(e) Attempting to move the transaction off-platform to avoid fees;
(f) Impersonating admin or other users.

**5.4 Message Retention**
All chat messages are retained by SajiloKheti for a period of 3 years for:
(a) Dispute resolution purposes;
(b) Legal compliance requirements;
(c) Platform security and fraud prevention.

**5.5 Moderation**
SajiloKheti reserves the right to review chats in cases of reported disputes or safety concerns. Violations of chat guidelines may result in immediate account suspension.`,
  },
  {
    id: "malpot",
    icon: <Building2 className="h-5 w-5" />,
    title: "6. Malpot Agreement & Legal Compliance",
    content: `**6.1 Mandatory Agreement Requirement**
A signed and official Malpot agreement (registered at a Nepal Land Revenue Office) is mandatory for the release of escrow funds. SajiloKheti will not release payment without an approved agreement.

**6.2 User Responsibility**
Both the Landowner and Leaser are responsible for:
(a) Visiting the correct Malpot Karyalaya (the one with jurisdiction over the land);
(b) Ensuring all information in the agreement is accurate;
(c) Obtaining the official office stamp and signatures;
(d) Uploading a clear, legible scan or photograph of the agreement.

**6.3 SajiloKheti's Role**
SajiloKheti acts as a facilitator — not a party to the lease agreement. SajiloKheti:
(a) Is NOT responsible for the content or legal validity of the Malpot agreement;
(b) Does NOT provide legal advice regarding the agreement;
(c) Reviews documents only to verify they appear authentic and complete;
(d) Is NOT liable for disputes arising from the agreement terms.

**6.4 Document Upload Standards**
Uploaded agreements must:
(a) Be in PDF, JPG, or PNG format, under 20MB;
(b) Clearly show all required fields, signatures, and official stamps;
(c) Be the actual registered agreement — not a draft or unofficial copy.

**6.5 Rejection and Re-Submission**
If the admin rejects a submitted agreement, the user will be notified with a specific reason. The user may re-upload a corrected document. Repeated fraudulent submissions may result in account termination.

**6.6 Compliance with Nepali Law**
All lease agreements facilitated through SajiloKheti must comply with:
- Muluki Civil Code, 2074 (land lease provisions)
- Land Act, 2021 (Bhumi Ain)
- Land Revenue Act, 2034`,
  },
  {
    id: "privacy",
    icon: <Lock className="h-5 w-5" />,
    title: "7. Privacy & Data Protection",
    content: `**7.1 Data Collection**
SajiloKheti collects the following personal data:
(a) Account registration data (name, email, phone number);
(b) KYC documents (citizenship certificate, selfie);
(c) Land listing data (location, photos, documents);
(d) Transaction and payment data;
(e) Chat messages and communication logs;
(f) Device and usage data (browser, IP address, location if permitted).

**7.2 Use of Data**
Your data is used to:
(a) Provide and improve Platform services;
(b) Verify identity and prevent fraud;
(c) Process payments securely;
(d) Resolve disputes;
(e) Comply with legal requirements.

**7.3 Data Sharing**
SajiloKheti does NOT sell your personal data. Data may be shared with:
(a) Payment processors (eSewa, Khalti) for transaction processing;
(b) Law enforcement upon valid legal request;
(c) Admin staff for dispute resolution.

**7.4 Data Retention**
- Account data: Retained while account is active, deleted within 90 days of deletion request
- KYC documents: Retained for 5 years per financial compliance requirements
- Transaction records: Retained for 7 years per Nepali accounting standards
- Chat logs: Retained for 3 years

**7.5 Your Rights**
You have the right to:
(a) Request access to your personal data;
(b) Request correction of inaccurate data;
(c) Request deletion of data (subject to legal retention requirements);
(d) Withdraw consent for non-essential data processing.

To exercise these rights, contact: privacy@sajilokheti.com`,
  },
  {
    id: "prohibited",
    icon: <AlertTriangle className="h-5 w-5" />,
    title: "8. Prohibited Activities",
    content: `The following activities are strictly prohibited on SajiloKheti and may result in immediate account termination, legal action, or both:

**8.1 Fraud and Misrepresentation**
(a) Submitting false KYC documents or identity information;
(b) Listing land that you do not own or have authority to lease;
(c) Misrepresenting land features, location, size, or condition;
(d) Creating multiple accounts to circumvent restrictions.

**8.2 Financial Misconduct**
(a) Requesting payments outside the platform (direct bank transfer, cash) to avoid escrow;
(b) Laundering money through the platform;
(c) Providing false banking information for refunds;
(d) Exploiting payment systems or chargebacks fraudulently.

**8.3 Platform Abuse**
(a) Scraping, crawling, or copying Platform content without permission;
(b) Reverse engineering the Platform's software or security systems;
(c) Submitting spam applications with no genuine intent to lease;
(d) Interfering with the Platform's operation or other users' accounts.

**8.4 Harassment and Illegal Content**
(a) Harassing, threatening, or abusing other users;
(b) Sharing explicit, illegal, or hate content;
(c) Violating any applicable law in Nepal or internationally.`,
  },
  {
    id: "liability",
    icon: <Gavel className="h-5 w-5" />,
    title: "9. Limitation of Liability & Disclaimers",
    content: `**9.1 Platform as Facilitator**
SajiloKheti is a technology platform that facilitates connections between Landowners and Land Leasers. We are NOT a party to any lease agreement and do NOT guarantee:
(a) The quality, safety, or legality of any listed land;
(b) The accuracy of land information provided by Landowners;
(c) That any transaction will be completed successfully;
(d) The behavior or reliability of any user.

**9.2 Limitation of Liability**
To the maximum extent permitted by Nepali law, SajiloKheti shall NOT be liable for:
(a) Loss of profits, revenue, or land value;
(b) Personal injury or property damage related to a leased plot;
(c) Disputes between Landowners and Leasers;
(d) Losses resulting from fraudulent user actions;
(e) Technical failures, data loss, or service interruptions.

**9.3 No Legal Advice**
SajiloKheti does not provide legal advice. Information on the Platform regarding Malpot processes, land law, or contracts is for general informational purposes only. Consult a qualified Nepali lawyer for legal advice.

**9.4 Third-Party Services**
SajiloKheti integrates third-party services (Google Maps, eSewa, Khalti, Clerk authentication). We are not responsible for the availability, accuracy, or conduct of these services.

**9.5 Maximum Liability Cap**
If SajiloKheti is found liable for any reason, our total liability shall not exceed the total platform fees paid by you in the 6 months preceding the claim.`,
  },
  {
    id: "disputes",
    icon: <Shield className="h-5 w-5" />,
    title: "10. Dispute Resolution",
    content: `**10.1 Internal Resolution**
If a dispute arises between a Landowner and Leaser, the parties should first attempt to resolve it via:
(a) Direct communication through the Platform's chat;
(b) Filing a formal complaint via the Report & Suggest feature;
(c) Contacting SajiloKheti support at support@sajilokheti.com.

SajiloKheti will attempt to mediate disputes within 5–10 business days.

**10.2 Admin Decisions**
Admin decisions regarding Malpot agreement approval/rejection and escrow fund release are final unless appealed within 7 days with new evidence.

**10.3 Governing Law**
These Terms shall be governed by and construed in accordance with the laws of Nepal, without regard to conflict of law principles.

**10.4 Jurisdiction**
Any legal proceedings arising from these Terms shall be submitted to the exclusive jurisdiction of the courts located in Kathmandu, Nepal.

**10.5 Arbitration**
For commercial disputes exceeding NPR 500,000, the parties agree to binding arbitration under the Arbitration Act, 2055 of Nepal before resorting to court proceedings.`,
  },
  {
    id: "modifications",
    icon: <RefreshCw className="h-5 w-5" />,
    title: "11. Modifications to Terms",
    content: `**11.1 Right to Modify**
SajiloKheti reserves the right to modify, update, or replace these Terms at any time at our sole discretion.

**11.2 Notice of Changes**
When we make material changes, we will:
(a) Send an email notification to your registered address at least 14 days before changes take effect;
(b) Display a prominent notice on the Platform;
(c) Update the "Last Updated" date at the top of this page.

**11.3 Continued Use**
Your continued use of the Platform after the effective date of changes constitutes your acceptance of the revised Terms. If you disagree with any changes, you must discontinue use and may request account deletion.

**11.4 Archived Versions**
Previous versions of these Terms are archived and available upon request at legal@sajilokheti.com.`,
  },
  {
    id: "contact",
    icon: <Mail className="h-5 w-5" />,
    title: "12. Contact Information",
    content: `For questions, concerns, or legal notices regarding these Terms, please contact:

**SajiloKheti Legal Team**
Email: legal@sajilokheti.com
Support Email: support@sajilokheti.com
Phone: +977-01-4XXXXXX
Office Hours: Sunday–Friday, 10:00 AM – 6:00 PM NPT

**Mailing Address:**
SajiloKheti Pvt. Ltd.
[Registered Office Address]
Kathmandu, Bagmati Province, Nepal

For privacy-related inquiries: privacy@sajilokheti.com
For complaints and reports: Use the Report & Suggest page on the Platform`,
  },
];

export default function TermsPage() {
  const [expandedClause, setExpandedClause] = useState<string | null>("acceptance");
  const [agreed, setAgreed] = useState(false);

  const toggleClause = (id: string) => {
    setExpandedClause(expandedClause === id ? null : id);
  };

  const renderContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <h4 key={i} className="font-bold text-gray-900 mt-4 mb-1">{line.replace(/\*\*/g, "")}</h4>;
      }
      if (line.includes("**")) {
        const parts = line.split("**");
        return (
          <p key={i} className="text-gray-700 mb-2 leading-relaxed text-sm">
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-gray-900">{part}</strong> : part)}
          </p>
        );
      }
      if (line.startsWith("(") && line.match(/^\([a-z]\)/)) {
        return <p key={i} className="ml-4 text-gray-700 mb-1 text-sm leading-relaxed">{line}</p>;
      }
      if (line.startsWith("-")) {
        return <li key={i} className="ml-4 text-gray-700 mb-1 text-sm">{line.replace(/^- /, "")}</li>;
      }
      return line.trim() ? <p key={i} className="text-gray-700 mb-2 leading-relaxed text-sm">{line}</p> : <div key={i} className="mb-1" />;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-emerald-600">🌱 SajiloKheti</Link>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link href="/docs" className="hover:text-emerald-600">Documentation</Link>
            <Link href="/help" className="hover:text-emerald-600">Help Center</Link>
            <Link href="/report" className="hover:text-emerald-600">Report / Suggest</Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 py-12 px-4 text-white text-center">
        <Shield className="h-10 w-10 mx-auto mb-3 text-emerald-400" />
        <h1 className="text-3xl font-bold mb-2">Terms & Conditions</h1>
        <p className="text-slate-300 max-w-lg mx-auto text-sm">
          Please read these Terms carefully before using SajiloKheti. They govern your use of the platform and create a legal agreement between you and SajiloKheti.
        </p>
        <div className="mt-4 inline-block bg-slate-700 rounded-full px-4 py-1.5 text-xs text-slate-300">
          Last Updated: {lastUpdated} &nbsp;·&nbsp; Effective: {lastUpdated}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Quick Summary */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-emerald-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Summary (Plain English)
          </h2>
          <ul className="space-y-2 text-sm text-emerald-800">
            {[
              "You must be 18+ to use SajiloKheti",
              "Landowners must complete KYC — submitting fake documents is illegal",
              "All lease payments go through our escrow — never pay anyone directly",
              "Money is only released to the Landowner after a signed Malpot agreement is approved",
              "Chat is only available after payment — all messages are logged for safety",
              "SajiloKheti charges a 2.5% service fee on successful transactions",
              "We protect your data and never sell it to third parties",
              "Disputes are first handled internally — then through Kathmandu courts",
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <ChevronRight className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                {point}
              </li>
            ))}
          </ul>
          <p className="text-xs text-emerald-700 mt-3 italic">This summary is for convenience only. The full legal text below governs your use of the Platform.</p>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">Table of Contents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {clauses.map((clause) => (
              <button
                key={clause.id}
                onClick={() => { setExpandedClause(clause.id); document.getElementById(clause.id)?.scrollIntoView({ behavior: "smooth" }); }}
                className="text-left text-sm text-emerald-600 hover:text-emerald-800 hover:underline py-1"
              >
                {clause.title}
              </button>
            ))}
          </div>
        </div>

        {/* Clauses */}
        <div className="space-y-3">
          {clauses.map((clause) => {
            const isOpen = expandedClause === clause.id;
            return (
              <div key={clause.id} id={clause.id} className={`bg-white rounded-2xl border shadow-sm transition-all ${isOpen ? "border-emerald-300 shadow-md" : "border-gray-200"}`}>
                <button
                  onClick={() => toggleClause(clause.id)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className={`p-2 rounded-xl ${isOpen ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                      {clause.icon}
                    </span>
                    <span className={`font-bold text-base ${isOpen ? "text-emerald-800" : "text-gray-900"}`}>{clause.title}</span>
                  </div>
                  {isOpen ? <ChevronDown className="h-5 w-5 text-emerald-500 flex-shrink-0" /> : <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 border-t border-gray-100 pt-4">
                    {renderContent(clause.content)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Agreement Checkbox */}
        <div className="mt-10 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-3">Agreement Confirmation</h3>
          <label className="flex items-start gap-3 cursor-pointer mb-5">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 mt-0.5 accent-emerald-600 flex-shrink-0"
            />
            <span className="text-sm text-gray-700 leading-relaxed">
              I have read, understood, and agree to be bound by SajiloKheti's Terms & Conditions, Privacy Policy, and all applicable platform rules. I understand that violation of these Terms may result in account suspension or legal action under Nepali law.
            </span>
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/sign-up" className={`flex-1 py-3 rounded-xl text-center font-semibold text-sm transition-all ${agreed ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-100 text-gray-400 pointer-events-none"}`}>
              I Agree — Create My Account
            </Link>
            <Link href="/" className="flex-1 py-3 rounded-xl text-center font-semibold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all">
              Return to Homepage
            </Link>
          </div>
        </div>

        {/* Legal Footer */}
        <div className="mt-8 text-center text-xs text-gray-400 space-y-1">
          <p>These Terms & Conditions are governed by the laws of Nepal.</p>
          <p>For legal inquiries: <a href="mailto:legal@sajilokheti.com" className="text-emerald-600 hover:underline">legal@sajilokheti.com</a></p>
          <p>SajiloKheti Pvt. Ltd. · Kathmandu, Nepal · Registered under Companies Act, 2063</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12 py-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} SajiloKheti. All rights reserved. &nbsp;·&nbsp;
          <Link href="/docs" className="hover:text-emerald-600">Documentation</Link> &nbsp;·&nbsp;
          <Link href="/help" className="hover:text-emerald-600">Help Center</Link> &nbsp;·&nbsp;
          <Link href="/report" className="hover:text-emerald-600">Report / Suggest</Link>
        </p>
      </footer>
    </div>
  );
}