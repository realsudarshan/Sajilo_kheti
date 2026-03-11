"use server"
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email") as string;

  try {
    // Instead of Prisma, we just push to a Resend Audience list
    await resend.contacts.create({
      email: email,
      unsubscribed: false,
      audienceId: "1850ea97-31b4-4140-acb4-7ff268619b55", // Get this from Resend Dashboard
    });

    return { success: true };
  } catch (error) {
    return { error: "Failed to join list." };
  }
}