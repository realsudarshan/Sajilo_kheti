"use server"
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = "1850ea97-31b4-4140-acb4-7ff268619b55";

export async function sendBroadcast(formData: FormData) {
  const subject = formData.get("subject") as string;
  const content = formData.get("content") as string;

  try {
    await resend.broadcasts.create({
      audienceId: AUDIENCE_ID,
      from: 'Sajilo Kheti <updates@yourdomain.com>', // Must be your verified domain
      subject: subject,
      html: `
        <div style="font-family: sans-serif; color: #064e3b;">
          <h1 style="color: #065f46;">Sajilo Kheti Update</h1>
          <p>${content}</p>
          <hr />
          <p style="font-size: 12px; color: #6b7280;">
            You received this because you subscribed to Sajilo Kheti. 
            <a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Unsubscribe</a>
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    return { error: "Failed to send broadcast." };
  }
}