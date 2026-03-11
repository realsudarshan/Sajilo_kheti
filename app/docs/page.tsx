"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  MapPin,
  MessageSquare,
  FileText,
  Shield,
  CreditCard,
  User,
  Search,
  Home,
  Sprout,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Navigation,
} from "lucide-react";

const sections = [
  {
    id: "getting-started",
    icon: <Sprout className="h-5 w-5" />,
    title: "Getting Started",
    color: "emerald",
    topics: [
      {
        id: "create-account",
        title: "Creating Your Account",
        content: `
## Creating Your Account on SajiloKheti

SajiloKheti uses a secure, two-step registration process to ensure all users are verified.

### Step 1: Sign Up
1. Visit **sajilokheti.com** and click **"Get Started"** or **"Sign Up"** in the top navigation.
2. Enter your **full name**, **email address**, and a **strong password**.
3. Alternatively, use **Google or GitHub** for one-click sign-in via OAuth.
4. Verify your email address by clicking the link sent to your inbox.

### Step 2: Complete Your Profile
After email verification, you'll be redirected to your dashboard where you can:
- Upload a **profile photo**
- Set your **preferred language** (Nepali / English)
- Choose your role: **Land Leaser** (farmer) or proceed to KYC to become a **Land Owner**

> **Note:** All users start as Land Leasers. To list land, you must complete KYC verification.
        `,
      },
      {
        id: "kyc-verification",
        title: "KYC Verification (Landowner Upgrade)",
        content: `
## KYC Verification — Become a Verified Landowner

To list land on SajiloKheti, you must complete Know Your Customer (KYC) verification. This ensures trust and safety for all parties.

### Who Needs KYC?
Anyone who wants to **list land for lease** must be KYC-verified. Land Leasers (farmers) do not need KYC to browse or apply.

### Required Documents
- **Citizenship Certificate** (front and back scan/photo)
- **Selfie** holding your citizenship document (optional but recommended for faster approval)

### Steps to Submit KYC
1. Go to your **Dashboard** → click **"Become a Landowner"** or **"Verify Identity"**
2. Upload your **Citizenship Certificate** photo (clear, well-lit image, under 10MB)
3. Upload a **selfie** holding the document (optional)
4. Enter your **Citizenship Number**
5. Click **"Submit for Review"**

### Review Timeline
- KYC is reviewed by our admin team within **1–3 business days**
- You'll receive an **email notification** when approved or rejected
- If rejected, you can **resubmit** with corrected documents

### After Approval
Once approved:
- Your account role changes to **OWNER**
- You can access **"List New Land"** in your Landowner Dashboard
- Your listings will appear in the public land marketplace
        `,
      },
      {
        id: "two-roles",
        title: "Understanding the Two Roles",
        content: `
## Land Leaser vs. Land Owner

SajiloKheti has two primary user roles. Understanding which one applies to you is important.

### 🌾 Land Leaser (Farmer / Tenant)
- Browse and search all available land listings
- Send **lease applications** with farming plans and proposed rent
- Chat with Landowners **after a lease is approved and payment is made**
- Navigate to the land location and nearest **Malpot Karyalaya** via Google Maps
- Upload the **Malpot agreement paper** to finalize the lease
- Receive confirmation once the admin releases payment to the landowner

### 🏡 Land Owner
- Must complete **KYC verification** first
- List land for lease with details, photos, pricing, and GPS location
- Review incoming **applications** from farmers
- Accept or reject applications
- Chat with the approved Leaser after payment is received
- Navigate to the **Malpot Karyalaya** for agreement signing
- Receive payment once the **admin approves** the uploaded Malpot agreement

> A single user account can only hold one role at a time. If you are already a Leaser and want to become an Owner, you must complete KYC.
        `,
      },
    ],
  },
  {
    id: "finding-land",
    icon: <Search className="h-5 w-5" />,
    title: "Finding & Applying for Land",
    color: "blue",
    topics: [
      {
        id: "browse-listings",
        title: "Browsing Land Listings",
        content: `
## How to Browse Land Listings

The SajiloKheti marketplace lets you find available farmland near you with detailed filters.

### Accessing Listings
1. Log in and go to your **Leaser Dashboard**
2. Click **"Find Land"** in the sidebar
3. All available, verified listings are displayed

### Search & Filter Options
- **Location** — Search by district, VDC/municipality, or address
- **Price Range** — Set minimum and maximum monthly rent
- **Land Size** — Filter by area in Ropani, Dhur, or square meters
- **Land Type** — Agricultural, Horticulture, Terrace, Flatland
- **Availability Status** — Show only "Available" listings

### Reading a Listing
Each listing includes:
- **Title and description** of the land
- **Hero image** and additional gallery photos
- **Exact location** with a Google Maps preview
- **Price per month** and **total area**
- **Owner's verified badge** confirming KYC status
- **Distance** from your current location (if location is enabled)

### Saving Favorites
Click the **bookmark icon** on any listing to save it. Access saved lands under **"My Favorites"** in your dashboard.
        `,
      },
      {
        id: "send-application",
        title: "Sending a Lease Application",
        content: `
## How to Send a Lease Application

Once you've found a land you're interested in, here's how to apply:

### Application Steps
1. Open the land listing you want to apply for
2. Click **"Apply for This Land"** or **"Send Application"**
3. Fill out the application form:
   - **Farming Plans** — Describe what you plan to grow, your farming experience, and goals
   - **Proposed Monthly Rent** — Enter the rent you're willing to pay per month
   - **Lease Duration** — Select the number of months (minimum 3, maximum 60)
4. Review your application and click **"Submit Application"**

### After Submission
- The **Landowner receives a notification** of your application
- Your application status will show as **PENDING** in your dashboard
- The Landowner can **Accept** or **Reject** your application

### If Accepted
1. You'll receive a notification that your application was **ACCEPTED**
2. You'll be prompted to **make the lease payment** through the platform
3. Funds are held in **escrow** by SajiloKheti — NOT sent to the landowner yet
4. Once payment is confirmed, the **Chat feature is unlocked** with the Landowner

> Only one application per land listing is accepted. Once accepted, other applications for that land are automatically closed.
        `,
      },
    ],
  },
  {
    id: "payments-escrow",
    icon: <CreditCard className="h-5 w-5" />,
    title: "Payments & Escrow",
    color: "violet",
    topics: [
      {
        id: "how-escrow-works",
        title: "How the Escrow System Works",
        content: `
## SajiloKheti Escrow Payment System

SajiloKheti uses a **secure escrow model** to protect both parties in every transaction.

### What is Escrow?
Escrow means your payment is held securely by SajiloKheti and is **only released to the Landowner** after specific conditions are met. This protects farmers from fraud and gives landowners confidence.

### The Payment Flow

\`\`\`
Leaser Makes Payment
        ↓
Funds Held in Escrow (SajiloKheti)
        ↓
Chat & Navigation Unlocked
        ↓
Both Parties Visit Malpot Karyalaya
        ↓
Agreement Paper Uploaded
        ↓
Admin Reviews & Approves
        ↓
Payment Released to Landowner ✓
\`\`\`

### Supported Payment Methods
- **eSewa**
- **Khalti**
- **Bank Transfer (NABIL, NIC Asia, Global IME)**
- **Cash (at partner Malpot offices)** — requires manual confirmation

### Security Guarantees
- Funds are never accessible by the Landowner until conditions are met
- If the agreement is rejected, funds are **fully refunded** to the Leaser
- All transactions are logged and available in your **Transaction History**

### Platform Fee
SajiloKheti charges a **2.5% service fee** on each transaction to maintain the platform. This is deducted from the total amount before releasing to the Landowner.
        `,
      },
      {
        id: "payment-steps",
        title: "Making a Payment",
        content: `
## Step-by-Step: Making Your Lease Payment

After your application is accepted by the Landowner, follow these steps:

### Step 1: Go to Payment
1. In your dashboard, open the **"My Applications"** or **"Active Leases"** section
2. Find the accepted application and click **"Proceed to Payment"**

### Step 2: Choose Payment Method
Select from:
- eSewa
- Khalti  
- Direct Bank Transfer

### Step 3: Confirm Amount
Review the payment breakdown:
- Monthly rent × lease duration
- Platform service fee (2.5%)
- **Total to pay**

### Step 4: Complete Payment
- Follow the prompts for your chosen payment gateway
- You'll receive a **payment receipt** via email
- Your dashboard status updates to **"Payment Confirmed"**

### Step 5: Chat Unlocked
Once payment is confirmed:
- A **chat room** opens between you and the Landowner
- You can now discuss logistics, schedule land visits, and plan the Malpot process

> **Tip:** Save your payment receipt. You may need it during the Malpot agreement process.
        `,
      },
    ],
  },
  {
    id: "chat-navigation",
    icon: <MessageSquare className="h-5 w-5" />,
    title: "Chat & Navigation",
    color: "teal",
    topics: [
      {
        id: "chat-feature",
        title: "Using the Chat Feature",
        content: `
## In-Platform Chat Between Landowner & Leaser

After a successful payment, a **private chat room** is unlocked between the Land Owner and Land Leaser. This is the primary communication channel for coordinating your lease.

### Accessing the Chat
1. Go to your **Dashboard** → **"My Leases"** (Leaser) or **"My Lands"** (Owner)
2. Find the active lease
3. Click the **💬 Chat** button or **"Open Chat"**

### What You Can Do in Chat
- **Send text messages** in real-time
- **Share files and documents** (e.g., images of the land, identity documents)
- Coordinate a **time to visit the land** together
- Discuss **logistics for visiting the Malpot Karyalaya**
- Clarify any details about the lease agreement

### Chat Guidelines
- Be respectful and professional at all times
- Do not share sensitive personal information like bank PINs
- All messages are **logged for dispute resolution** if needed
- Chat history is preserved for the duration of the lease

### Chat Restrictions
- Chat is only available **after payment is confirmed**
- Chat is **disabled** if either party's account is suspended
- Cannot share files larger than **25MB**

> Chats are monitored for safety. Violations of our community standards may result in account suspension.
        `,
      },
      {
        id: "google-maps",
        title: "Google Maps Navigation",
        content: `
## Navigating to Your Land & Malpot Karyalaya

SajiloKheti integrates with **Google Maps** to help both parties navigate to the correct locations.

### Finding the Land Location
1. Open your active lease from the dashboard
2. Click **"View on Map"** or **"Navigate to Land"**
3. A Google Maps view opens showing:
   - The **exact GPS pin** of the leased land
   - Your **current location** (if you grant permission)
   - Turn-by-turn directions from your location

### Finding the Nearest Malpot Karyalaya
After payment and before uploading the agreement:
1. In the lease detail page, click **"Find Nearest Malpot Karyalaya"**
2. Google Maps will show:
   - The **nearest Malpot (Land Revenue) office** to the land location
   - Distance and estimated travel time
   - Office address and phone number (if available)
3. Click **"Get Directions"** to open full navigation

### Tips for Using Navigation
- Enable **location permissions** in your browser for accurate distance
- The Malpot office shown is the one with **jurisdiction over the land** — you must go to the correct one
- Take screenshots of the map before visiting in case of connectivity issues in rural areas
- Coordinate with the other party to **visit the Malpot office together**

### About Malpot Karyalaya
The Malpot Karyalaya (Land Revenue Office) is a government office in Nepal responsible for land registration and transfer records. Signing your agreement here makes it **legally binding**.
        `,
      },
    ],
  },
  {
    id: "malpot-agreement",
    icon: <FileText className="h-5 w-5" />,
    title: "Malpot Agreement Process",
    color: "amber",
    topics: [
      {
        id: "what-is-malpot",
        title: "What is a Malpot Agreement?",
        content: `
## Malpot Agreement — Making Your Lease Legal

A **Malpot Agreement** (मालपोत सम्झौता) is an official land lease document registered at the **Malpot Karyalaya** (Land Revenue Office) in Nepal. It is the final and most important step in the SajiloKheti leasing process.

### Why is it Required?
- It creates a **legally binding** lease between the Landowner and Leaser
- It protects both parties' rights under Nepali land law
- It is a **condition for payment release** — the admin will not release escrow funds without an approved agreement

### What the Agreement Contains
- **Full names and citizenship numbers** of both parties
- **Land details**: plot number (Kitta), area, district, VDC/municipality
- **Lease terms**: monthly rent amount, start date, end date
- **Signature and thumbprints** of both parties
- **Official stamp** from the Malpot Karyalaya

### Who Prepares It?
The Malpot Karyalaya staff assist with preparing the official agreement form. You may also bring a draft prepared by a lawyer, which the office will verify and register.

> **Important:** Both the Landowner and Leaser must be physically present at the Malpot Karyalaya to sign. Proxies require a notarized Power of Attorney.
        `,
      },
      {
        id: "upload-agreement",
        title: "Uploading the Agreement Paper",
        content: `
## How to Upload the Malpot Agreement

After signing the official agreement at the Malpot Karyalaya, you must upload a scanned copy to SajiloKheti to trigger payment release.

### Who Uploads?
Either the **Landowner** or **Leaser** can upload the agreement — coordinate with your counterpart to avoid duplicate uploads.

### Steps to Upload
1. Go to your **Dashboard** → find the active lease
2. Click **"Upload Malpot Agreement"**
3. Select your scanned/photographed document:
   - Accepted formats: **PDF, JPG, PNG**
   - Maximum file size: **20MB**
   - The document must be **clear and legible** — blurry images will be rejected
4. Add any **notes** for the admin (optional)
5. Click **"Submit for Review"**

### What Happens Next
- The **Admin team** reviews your uploaded document
- Review typically takes **1–3 business days**
- If approved:
  - Payment is **released to the Landowner** from escrow
  - Both parties receive an **email confirmation**
  - The lease status updates to **"ACTIVE"**
- If rejected:
  - You'll receive a **reason for rejection** via email
  - You can **re-upload** a corrected document

### Common Reasons for Rejection
- Document is blurry or unreadable
- Missing signatures or thumbprints
- Land details don't match the listing
- Agreement not signed at an official Malpot Karyalaya

> **Pro Tip:** Use a document scanner app (Adobe Scan, CamScanner) for the best quality. Natural lighting works too — avoid flash glare on official stamps.
        `,
      },
      {
        id: "admin-approval",
        title: "Admin Review & Payment Release",
        content: `
## Admin Review and Final Payment Release

The final step in the SajiloKheti process is admin review of your Malpot agreement, which triggers payment release.

### The Review Process
Our admin team manually verifies:
1. **Document authenticity** — Does it appear to be an official Malpot document?
2. **Party details** — Do the names and citizenship numbers match the accounts?
3. **Land details** — Does the plot number and area match the listing?
4. **Signatures** — Are both party signatures present?
5. **Office stamp** — Is the Malpot Karyalaya official stamp visible?

### Timeline
- Standard review: **1–3 business days**
- Expedited review (for flagged accounts): up to **5 business days**

### Payment Release
Once the admin **approves** the agreement:
- The escrow amount is transferred to the **Landowner's registered bank account or digital wallet**
- The **platform service fee (2.5%)** is deducted before transfer
- Both parties receive a **transaction receipt** via email
- The lease is officially marked as **ACTIVE**

### If There's a Dispute
If either party believes the review is unfair:
1. Contact support at **support@sajilokheti.com**
2. Or file a report using the **Report & Suggest** feature (in the Help Center)
3. Include your lease ID and a description of the issue

> All admin decisions are logged and can be appealed within **7 days** of the decision.
        `,
      },
    ],
  },
  {
    id: "account-settings",
    icon: <User className="h-5 w-5" />,
    title: "Account & Settings",
    color: "rose",
    topics: [
      {
        id: "profile-settings",
        title: "Managing Your Profile",
        content: `
## Managing Your SajiloKheti Profile

Keep your profile up to date to maintain trust with other users.

### Updating Basic Information
1. Click your **profile avatar** in the top right
2. Select **"Account Settings"**
3. Edit: Full name, phone number, location, bio
4. Click **"Save Changes"**

### Changing Your Password
1. Go to **Account Settings** → **Security**
2. Click **"Change Password"**
3. Enter your current password and new password
4. Confirm the new password and save

> If you signed up with Google/GitHub, you must set a password first via **"Forgot Password"** on the login page.

### Profile Photo
- Click on your avatar to upload a new photo
- Accepted formats: JPG, PNG (max 5MB)
- Square images work best (1:1 ratio)

### Notification Preferences
Under **Settings → Notifications**, you can configure:
- Email alerts for new applications
- Chat message notifications
- Payment and transaction alerts
- Lease status updates

### Deactivating Your Account
Go to **Settings → Account → Deactivate Account**. Note that:
- Active leases must be completed first
- Escrow funds will be held until resolution
- Your listings will be hidden from public view
        `,
      },
    ],
  },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [activeTopic, setActiveTopic] = useState("create-account");
  const [expandedSections, setExpandedSections] = useState<string[]>(["getting-started"]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((s) => s !== sectionId)
        : [...prev, sectionId]
    );
  };

  const currentSection = sections.find((s) => s.id === activeSection);
  const currentTopic = currentSection?.topics.find((t) => t.id === activeTopic);

  const colorMap: Record<string, string> = {
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-200",
    blue: "text-blue-600 bg-blue-50 border-blue-200",
    violet: "text-violet-600 bg-violet-50 border-violet-200",
    teal: "text-teal-600 bg-teal-50 border-teal-200",
    amber: "text-amber-600 bg-amber-50 border-amber-200",
    rose: "text-rose-600 bg-rose-50 border-rose-200",
  };

  const activeBg: Record<string, string> = {
    emerald: "bg-emerald-600",
    blue: "bg-blue-600",
    violet: "bg-violet-600",
    teal: "bg-teal-600",
    amber: "bg-amber-600",
    rose: "bg-rose-600",
  };

  // Render markdown-like content
  const renderContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("## ")) return <h2 key={i} className="text-2xl font-bold text-gray-900 mt-6 mb-3">{line.replace("## ", "")}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} className="text-lg font-semibold text-gray-800 mt-5 mb-2">{line.replace("### ", "")}</h3>;
      if (line.startsWith("- **")) {
        const parts = line.replace("- **", "").split("**");
        return <li key={i} className="ml-4 mb-1 text-gray-700"><span className="font-semibold text-gray-900">{parts[0]}</span>{parts[1]}</li>;
      }
      if (line.startsWith("- ")) return <li key={i} className="ml-4 mb-1 text-gray-700">{line.replace("- ", "")}</li>;
      if (line.startsWith("> ")) return <blockquote key={i} className="border-l-4 border-emerald-400 pl-4 py-1 my-3 bg-emerald-50 rounded-r-lg text-emerald-800 text-sm italic">{line.replace("> ", "")}</blockquote>;
      if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ") || line.startsWith("4. ") || line.startsWith("5. ")) {
        const content = line.replace(/^\d+\. /, "");
        const num = line.match(/^(\d+)\./)?.[1];
        const boldParts = content.split("**");
        return (
          <div key={i} className="flex gap-3 mb-2 ml-2">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center mt-0.5">{num}</span>
            <p className="text-gray-700">
              {boldParts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-gray-900">{part}</strong> : part)}
            </p>
          </div>
        );
      }
      if (line.startsWith("```") || line === "") return <div key={i} className="mb-2" />;
      if (line.includes("↓")) return <p key={i} className="text-center text-gray-400 my-1 font-mono text-sm">{line}</p>;

      const boldParts = line.split("**");
      if (boldParts.length > 1) {
        return (
          <p key={i} className="text-gray-700 mb-2 leading-relaxed">
            {boldParts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-gray-900">{part}</strong> : part)}
          </p>
        );
      }
      return line.trim() ? <p key={i} className="text-gray-700 mb-2 leading-relaxed">{line}</p> : null;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-emerald-600">🌱 SajiloKheti</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link href="/help" className="hover:text-emerald-600 transition-colors">Help Center</Link>
            <Link href="/report" className="hover:text-emerald-600 transition-colors">Report / Suggest</Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <BookOpen className="h-7 w-7" />
            <h1 className="text-3xl font-bold">Documentation</h1>
          </div>
          <p className="text-emerald-100 text-lg mb-6">
            Everything you need to know about using SajiloKheti — from creating an account to completing your lease.
          </p>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documentation..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-72 flex-shrink-0 hidden md:block">
          <div className="sticky top-8 space-y-1 bg-white rounded-2xl border border-gray-200 p-3 shadow-sm">
            {sections.map((section) => {
              const isExpanded = expandedSections.includes(section.id);
              const color = colorMap[section.color];
              return (
                <div key={section.id}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`p-1.5 rounded-lg border ${color}`}>{section.icon}</span>
                      <span className="font-semibold text-gray-800 text-sm">{section.title}</span>
                    </div>
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                  </button>
                  {isExpanded && (
                    <div className="ml-8 mt-1 space-y-0.5">
                      {section.topics.map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() => {
                            setActiveSection(section.id);
                            setActiveTopic(topic.id);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            activeTopic === topic.id
                              ? `text-white font-medium ${activeBg[section.color]}`
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          }`}
                        >
                          {topic.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {currentTopic && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link href="/docs" className="hover:text-emerald-600">Docs</Link>
                <ChevronRight className="h-3 w-3" />
                <span>{currentSection?.title}</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-900 font-medium">{currentTopic.title}</span>
              </div>
              <div className="prose max-w-none">
                {renderContent(currentTopic.content)}
              </div>

              {/* Navigation arrows */}
              <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between">
                <div />
                <Link href="/help" className="flex items-center gap-2 text-emerald-600 font-medium hover:underline text-sm">
                  Need more help? Visit Help Center <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />, title: "Start Your Journey", desc: "Register and find your first land", href: "/sign-up" },
              { icon: <Clock className="h-5 w-5 text-blue-500" />, title: "Track Your Application", desc: "See real-time lease status", href: "/dashboard" },
              { icon: <AlertCircle className="h-5 w-5 text-amber-500" />, title: "Report an Issue", desc: "Complain or suggest features", href: "/report" },
            ].map((card, i) => (
              <Link key={i} href={card.href} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-emerald-300 hover:shadow-sm transition-all flex items-start gap-3 group">
                <div className="mt-0.5">{card.icon}</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-emerald-700">{card.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{card.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12 py-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} SajiloKheti. All rights reserved. &nbsp;·&nbsp;
          <Link href="/terms" className="hover:text-emerald-600">Terms & Conditions</Link> &nbsp;·&nbsp;
          <Link href="/help" className="hover:text-emerald-600">Help Center</Link> &nbsp;·&nbsp;
          <Link href="/report" className="hover:text-emerald-600">Report / Suggest</Link>
        </p>
      </footer>
    </div>
  );
}