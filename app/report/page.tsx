"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertTriangle,
  Lightbulb,
  Bug,
  Shield,
  MessageSquare,
  ChevronDown,
  CheckCircle2,
  Upload,
  X,
  Loader2,
  ArrowRight,
  Info,
  Star,
  Flag,
  FileText,
} from "lucide-react";

type ReportType = "complaint" | "suggestion" | "bug" | "safety" | null;

const reportTypes = [
  {
    id: "complaint" as ReportType,
    icon: <Flag className="h-6 w-6" />,
    title: "File a Complaint",
    desc: "Report a user, listing, or transaction dispute",
    color: "red",
    bgClass: "bg-red-50 border-red-200 hover:bg-red-100",
    activeClass: "bg-red-600 text-white border-red-600",
    textClass: "text-red-700",
  },
  {
    id: "suggestion" as ReportType,
    icon: <Lightbulb className="h-6 w-6" />,
    title: "Make a Suggestion",
    desc: "Suggest features or improvements to the platform",
    color: "emerald",
    bgClass: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
    activeClass: "bg-emerald-600 text-white border-emerald-600",
    textClass: "text-emerald-700",
  },
  {
    id: "bug" as ReportType,
    icon: <Bug className="h-6 w-6" />,
    title: "Report a Bug",
    desc: "Something isn't working correctly on the platform",
    color: "amber",
    bgClass: "bg-amber-50 border-amber-200 hover:bg-amber-100",
    activeClass: "bg-amber-500 text-white border-amber-500",
    textClass: "text-amber-700",
  },
  {
    id: "safety" as ReportType,
    icon: <Shield className="h-6 w-6" />,
    title: "Safety Concern",
    desc: "Report fraud, scam, or safety issue",
    color: "violet",
    bgClass: "bg-violet-50 border-violet-200 hover:bg-violet-100",
    activeClass: "bg-violet-600 text-white border-violet-600",
    textClass: "text-violet-700",
  },
];

const complaintSubjects = [
  "Landowner behaving inappropriately in chat",
  "Leaser behaving inappropriately in chat",
  "Fraudulent land listing",
  "Payment not received after agreement approval",
  "Malpot agreement dispute",
  "Unfair admin decision",
  "Identity fraud / impersonation",
  "Land details don't match the listing",
  "Other complaint",
];

const suggestionSubjects = [
  "New platform feature request",
  "Improve existing feature",
  "Better search filters",
  "Improve mobile experience",
  "Add more payment methods",
  "Multilingual support improvement",
  "Notification improvements",
  "Performance / speed issue",
  "Other suggestion",
];

const bugSubjects = [
  "Chat not loading",
  "Payment failed but money was deducted",
  "Cannot upload documents",
  "Google Maps not working",
  "Login / authentication issue",
  "Application not submitting",
  "Wrong status showing on dashboard",
  "Notification not received",
  "Other bug",
];

const safetySubjects = [
  "Suspected fraud or scam",
  "User threatening or harassing me",
  "Fake identity / false documents",
  "Money demanded outside the platform",
  "Suspicious account activity",
  "Land shown is not owned by lister",
  "Other safety concern",
];

const subjectsByType: Record<string, string[]> = {
  complaint: complaintSubjects,
  suggestion: suggestionSubjects,
  bug: bugSubjects,
  safety: safetySubjects,
};

const priorityLevels = [
  { value: "low", label: "Low — Not urgent", color: "text-gray-600" },
  { value: "medium", label: "Medium — Needs attention", color: "text-amber-600" },
  { value: "high", label: "High — Urgent issue", color: "text-orange-600" },
  { value: "critical", label: "Critical — Safety / financial risk", color: "text-red-600" },
];

export default function ReportPage() {
  const [reportType, setReportType] = useState<ReportType>(null);
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("medium");
  const [leaseId, setLeaseId] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [charCount, setCharCount] = useState(0);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setAttachedFile(file);
    } else if (file) {
      alert("File must be under 10MB.");
    }
  };

  const handleSubmit = async () => {
    if (!reportType || !subject || !description) return;
    setSubmitting(true);
    // Simulate API call
    await new Promise((res) => setTimeout(res, 1800));
    setSubmitting(false);
    setSubmitted(true);
  };

  const isValid = reportType && subject && description.length >= 30;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link href="/" className="text-xl font-bold text-emerald-600">🌱 SajiloKheti</Link>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Report Submitted!</h2>
            <p className="text-gray-600 mb-2">
              Your report has been received by our team. We'll review it within <strong>1–3 business days</strong>.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              A confirmation has been sent to your registered email. Your report reference ID:
              <span className="font-mono text-emerald-600 font-bold block mt-1 text-lg">
                SK-{Math.random().toString(36).slice(2, 10).toUpperCase()}
              </span>
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/dashboard" className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
                Back to Dashboard
              </Link>
              <button onClick={() => { setSubmitted(false); setReportType(null); setSubject(""); setDescription(""); setLeaseId(""); setAttachedFile(null); setRating(0); }}
                className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                Submit Another Report
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-emerald-600">🌱 SajiloKheti</Link>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link href="/docs" className="hover:text-emerald-600">Documentation</Link>
            <Link href="/help" className="hover:text-emerald-600">Help Center</Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 py-12 px-4 text-white text-center">
        <AlertTriangle className="h-10 w-10 mx-auto mb-3 text-amber-400" />
        <h1 className="text-3xl font-bold mb-2">Report & Suggest</h1>
        <p className="text-gray-300 max-w-lg mx-auto">
          Help us improve SajiloKheti. File complaints, report bugs, flag safety issues, or suggest new features.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Emergency Banner for Safety */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex gap-3 items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-red-800">For immediate safety threats</p>
            <p className="text-red-600 mt-0.5">
              If you are in immediate danger, please contact Nepal Police at <strong>100</strong>. For financial fraud, contact Nepal Rastra Bank Complaint Unit at <strong>01-4410158</strong>.
            </p>
          </div>
        </div>

        {/* Step 1: Choose Type */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-5">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-sm font-bold flex items-center justify-center">1</span>
            <h2 className="text-lg font-bold text-gray-900">What would you like to do?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reportTypes.map((type) => {
              const isActive = reportType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => { setReportType(type.id); setSubject(""); }}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${isActive ? type.activeClass : `${type.bgClass} border-transparent`}`}
                >
                  <div className={`flex-shrink-0 mt-0.5 ${isActive ? "text-white" : type.textClass}`}>{type.icon}</div>
                  <div>
                    <p className={`font-semibold text-sm ${isActive ? "text-white" : "text-gray-900"}`}>{type.title}</p>
                    <p className={`text-xs mt-0.5 ${isActive ? "text-white/80" : "text-gray-500"}`}>{type.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Subject */}
        {reportType && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-5">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-sm font-bold flex items-center justify-center">2</span>
              <h2 className="text-lg font-bold text-gray-900">Select a subject</h2>
            </div>
            <div className="space-y-2">
              {subjectsByType[reportType].map((s) => (
                <label key={s} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${subject === s ? "border-emerald-400 bg-emerald-50" : "border-gray-200 hover:bg-gray-50"}`}>
                  <input
                    type="radio"
                    name="subject"
                    value={s}
                    checked={subject === s}
                    onChange={() => setSubject(s)}
                    className="accent-emerald-600"
                  />
                  <span className="text-sm text-gray-800">{s}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {subject && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-5">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-sm font-bold flex items-center justify-center">3</span>
              <h2 className="text-lg font-bold text-gray-900">Provide details</h2>
            </div>

            <div className="space-y-5">
              {/* Priority */}
              {(reportType === "complaint" || reportType === "safety" || reportType === "bug") && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Priority Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {priorityLevels.map((p) => (
                      <label key={p.value} className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer border transition-all text-sm ${priority === p.value ? "border-emerald-400 bg-emerald-50" : "border-gray-200 hover:bg-gray-50"}`}>
                        <input type="radio" name="priority" value={p.value} checked={priority === p.value} onChange={() => setPriority(p.value)} className="accent-emerald-600" />
                        <span className={`font-medium ${p.color}`}>{p.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Lease ID */}
              {(reportType === "complaint" || reportType === "safety") && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Lease ID / Listing ID <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <input
                    value={leaseId}
                    onChange={(e) => setLeaseId(e.target.value)}
                    placeholder="e.g. cm1abc2def3... (find it in your dashboard)"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                  />
                  <p className="text-xs text-gray-400 mt-1">Adding a Lease ID helps us investigate faster</p>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={handleDescriptionChange}
                  rows={6}
                  maxLength={2000}
                  placeholder={
                    reportType === "complaint"
                      ? "Describe exactly what happened. Include dates, messages, and any relevant context..."
                      : reportType === "suggestion"
                      ? "Describe your idea in detail. What problem does it solve? How should it work?..."
                      : reportType === "bug"
                      ? "Describe the bug. What did you do, what happened, and what did you expect?..."
                      : "Describe the safety concern in detail. Be as specific as possible..."
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                />
                <div className="flex justify-between mt-1">
                  <p className={`text-xs ${charCount < 30 ? "text-red-400" : "text-gray-400"}`}>
                    {charCount < 30 ? `Minimum 30 characters (${30 - charCount} more needed)` : `${charCount}/2000 characters`}
                  </p>
                </div>
              </div>

              {/* File Attachment */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Attach Evidence <span className="font-normal text-gray-400">(optional, max 10MB)</span>
                </label>
                {attachedFile ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm text-emerald-800 font-medium">{attachedFile.name}</span>
                      <span className="text-xs text-emerald-600">({(attachedFile.size / 1024).toFixed(0)} KB)</span>
                    </div>
                    <button onClick={() => setAttachedFile(null)} className="text-red-400 hover:text-red-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all">
                    <Upload className="h-6 w-6 text-gray-400" />
                    <span className="text-sm text-gray-500">Click to upload a screenshot or document</span>
                    <span className="text-xs text-gray-400">JPG, PNG, PDF accepted</span>
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>

              {/* Star Rating (for suggestions only) */}
              {reportType === "suggestion" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rate your current experience</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-110">
                        <Star className={`h-7 w-7 ${star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
                      </button>
                    ))}
                    {rating > 0 && <span className="ml-2 text-sm text-gray-500 self-center">{["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}</span>}
                  </div>
                </div>
              )}

              {/* Contact Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Contact Email <span className="font-normal text-gray-400">(for follow-up)</span>
                </label>
                <input
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  type="email"
                  placeholder="your@email.com (auto-filled if logged in)"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              {/* Anonymous option */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600"
                />
                <span className="text-sm text-gray-700">Submit anonymously (we won't save your name with this report)</span>
              </label>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2 text-sm text-blue-700">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>Reports are reviewed by our admin team within 1–3 business days. For critical safety issues, we respond within 24 hours. All reports are confidential.</p>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!isValid || submitting}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${isValid && !submitting ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>Submit Report <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Links */}
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
          <Link href="/help" className="text-emerald-600 hover:underline flex items-center gap-1">Help Center</Link>
          <Link href="/docs" className="text-gray-500 hover:text-gray-900 flex items-center gap-1">Documentation</Link>
          <Link href="/terms" className="text-gray-500 hover:text-gray-900 flex items-center gap-1">Terms & Conditions</Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12 py-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} SajiloKheti. All rights reserved. &nbsp;·&nbsp;
          <Link href="/docs" className="hover:text-emerald-600">Documentation</Link> &nbsp;·&nbsp;
          <Link href="/help" className="hover:text-emerald-600">Help Center</Link> &nbsp;·&nbsp;
          <Link href="/terms" className="hover:text-emerald-600">Terms & Conditions</Link>
        </p>
      </footer>
    </div>
  );
}