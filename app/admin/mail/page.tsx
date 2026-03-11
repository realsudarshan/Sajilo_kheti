"use client"
import { sendBroadcast } from "@/app/actions/broadcast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export default function AdminEmailPanel() {
  const [loading, setLoading] = useState(false);

  async function handleSend(formData: FormData) {
    if (!confirm("Are you sure you want to send this to ALL subscribers?")) return;
    setLoading(true);
    await sendBroadcast(formData);
    setLoading(false);
    alert("Broadcast Sent!");
  }

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-xl border border-emerald-100 shadow-sm">
      <h1 className="text-2xl font-bold text-emerald-900 mb-6">Send Community Update</h1>
      <form action={handleSend} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Subject Line</label>
          <Input name="subject" placeholder="New land listing in Pokhara..." required />
        </div>
        <div>
          <label className="text-sm font-medium">Message Body (HTML supported)</label>
          <Textarea name="content" placeholder="Write your update here..." rows={10} required />
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-emerald-700 hover:bg-emerald-800">
          {loading ? "Sending to Audience..." : "Blast to All Subscribers"}
        </Button>
      </form>
    </div>
  );
}