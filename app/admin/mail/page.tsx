"use client"

import { sendBroadcast } from "@/app/actions/broadcast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import {
  Mail,
  Users,
  Sparkles,
  Eye,
  Send,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  FileText,
  Megaphone,
  Bell,
  Tag,
} from "lucide-react"

const templates = [
  {
    id: "new-listing",
    icon: <Tag className="h-4 w-4" />,
    label: "New Land Listing",
    subject: "🌾 New Land Available in {location}",
    body: `<h2>A new land listing is now available!</h2>\n<p>Dear Subscriber,</p>\n<p>We're excited to share a new land listing that just went live on SajiloKheti.</p>\n<ul>\n  <li><strong>Location:</strong> {location}</li>\n  <li><strong>Size:</strong> {size}</li>\n  <li><strong>Price:</strong> Rs {price}/month</li>\n</ul>\n<p>Visit <a href="https://sajilokheti.com">SajiloKheti</a> to learn more and apply.</p>\n<p>Best regards,<br/>The SajiloKheti Team</p>`,
  },
  {
    id: "announcement",
    icon: <Megaphone className="h-4 w-4" />,
    label: "Platform Announcement",
    subject: "📢 Important Update from SajiloKheti",
    body: `<h2>An Important Update</h2>\n<p>Dear Community Member,</p>\n<p>We have an important announcement to share with you.</p>\n<p>{announcement}</p>\n<p>Thank you for being part of the SajiloKheti community.</p>\n<p>Best regards,<br/>The SajiloKheti Team</p>`,
  },
  {
    id: "newsletter",
    icon: <Bell className="h-4 w-4" />,
    label: "Monthly Newsletter",
    subject: "🌱 SajiloKheti Monthly Update — {month}",
    body: `<h2>Monthly Platform Update</h2>\n<p>Dear Subscriber,</p>\n<p>Here's what happened on SajiloKheti this month:</p>\n<ul>\n  <li>New listings added: {listings}</li>\n  <li>Leases completed: {leases}</li>\n  <li>New users joined: {users}</li>\n</ul>\n<p>Thank you for your continued trust in SajiloKheti.</p>\n<p>Best regards,<br/>The SajiloKheti Team</p>`,
  },
]

const audienceOptions = [
  { value: "all",    label: "All Subscribers",   desc: "Everyone on your mailing list",        icon: <Users className="h-4 w-4" /> },
  { value: "leaser", label: "Land Leasers Only",  desc: "Users looking to lease land",          icon: <Users className="h-4 w-4" /> },
  { value: "owner",  label: "Land Owners Only",   desc: "KYC verified landowners",              icon: <Users className="h-4 w-4" /> },
]

type Status = "idle" | "sending" | "success" | "error"

export default function AdminEmailPanel() {
  const [subject,  setSubject]  = useState("")
  const [body,     setBody]     = useState("")
  const [audience, setAudience] = useState("all")
  const [preview,  setPreview]  = useState(false)
  const [status,   setStatus]   = useState<Status>("idle")
  const [showTemplates, setShowTemplates] = useState(false)

  const charCount = body.length
  const isValid   = subject.trim().length > 0 && body.trim().length > 0

  async function handleSend() {
    if (!isValid) return
    if (!confirm(`Send this email to all ${audienceOptions.find(a => a.value === audience)?.label}?`)) return

    setStatus("sending")
    try {
      const formData = new FormData()
      formData.append("subject",  subject)
      formData.append("content",  body)
      formData.append("audience", audience)
      await sendBroadcast(formData)
      setStatus("success")
      // reset after 3s
      setTimeout(() => {
        setStatus("idle")
        setSubject("")
        setBody("")
      }, 3000)
    } catch {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
    }
  }

  function applyTemplate(template: typeof templates[0]) {
    setSubject(template.subject)
    setBody(template.body)
    setShowTemplates(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Email Broadcast</h1>
            <p className="text-slate-500 text-sm mt-1">Send custom emails to your subscribers via Resend</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
            <Mail className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700">Powered by Resend</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Compose */}
          <div className="lg:col-span-2 space-y-4">

            {/* Templates */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span className="font-bold text-slate-800 text-sm">Start from a template</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showTemplates ? "rotate-180" : ""}`} />
              </button>

              {showTemplates && (
                <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-4">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => applyTemplate(t)}
                      className="flex flex-col gap-2 p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center text-slate-500 group-hover:text-emerald-600 transition-colors">
                        {t.icon}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{t.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Compose form */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="font-bold text-slate-800 text-sm">Compose Email</span>
              </div>

              {/* Subject */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Subject Line
                </label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. 🌾 New Land Available in Kathmandu"
                  className="rounded-xl border-slate-200 focus:border-emerald-400 focus:ring-emerald-400"
                />
                <p className="text-xs text-slate-400 mt-1">{subject.length} characters · Keep under 60 for best open rates</p>
              </div>

              {/* Body */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Message Body
                  </label>
                  <button
                    onClick={() => setPreview(!preview)}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    {preview ? "Edit" : "Preview"}
                  </button>
                </div>

                {preview ? (
                  <div
                    className="min-h-[280px] p-4 rounded-xl border border-slate-200 bg-slate-50 prose prose-sm max-w-none text-slate-700"
                    dangerouslySetInnerHTML={{ __html: body || "<p class='text-slate-400'>Nothing to preview yet...</p>" }}
                  />
                ) : (
                  <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your message here... HTML is supported."
                    rows={12}
                    className="rounded-xl border-slate-200 focus:border-emerald-400 focus:ring-emerald-400 font-mono text-sm resize-none"
                  />
                )}
                <p className="text-xs text-slate-400 mt-1">{charCount.toLocaleString()} characters · HTML supported</p>
              </div>
            </div>
          </div>

          {/* Right: Settings + Send */}
          <div className="space-y-4">

            {/* Audience */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
                <Users className="h-4 w-4 text-slate-400" />
                <span className="font-bold text-slate-800 text-sm">Audience</span>
              </div>
              <div className="space-y-2">
                {audienceOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      audience === opt.value
                        ? "border-emerald-400 bg-emerald-50"
                        : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="audience"
                      value={opt.value}
                      checked={audience === opt.value}
                      onChange={() => setAudience(opt.value)}
                      className="mt-0.5 accent-emerald-600"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{opt.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <p className="font-bold text-slate-800 text-sm pb-3 border-b border-slate-100 mb-3">Pre-send Checklist</p>
              <div className="space-y-2">
                {[
                  { label: "Subject line filled",  done: subject.trim().length > 0  },
                  { label: "Message body written",  done: body.trim().length > 0     },
                  { label: "Subject under 60 chars",done: subject.length <= 60 && subject.length > 0 },
                  { label: "Audience selected",     done: !!audience                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${item.done ? "bg-emerald-500" : "bg-slate-200"}`}>
                      {item.done && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </div>
                    <span className={`text-xs font-medium ${item.done ? "text-slate-700" : "text-slate-400"}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning */}
            <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                This will send a real email to all selected subscribers. This action cannot be undone.
              </p>
            </div>

            {/* Send Button */}
            {status === "success" ? (
              <div className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-emerald-500 text-white font-bold text-sm">
                <CheckCircle2 className="h-4 w-4" /> Broadcast Sent!
              </div>
            ) : status === "error" ? (
              <div className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-red-500 text-white font-bold text-sm">
                <AlertTriangle className="h-4 w-4" /> Failed — Try Again
              </div>
            ) : (
              <Button
                onClick={handleSend}
                disabled={!isValid || status === "sending"}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 font-black text-sm gap-2 shadow-sm"
              >
                {status === "sending" ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                ) : (
                  <><Send className="h-4 w-4" /> Send Broadcast</>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}