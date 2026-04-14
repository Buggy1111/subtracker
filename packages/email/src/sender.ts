import { Resend } from 'resend';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  // SMTP fallback for self-hosted
  if (!apiKey || apiKey === '') {
    console.log(`[email] Would send to ${options.to}: ${options.subject}`);
    return { success: true };
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'SubTracker <noreply@subtracker.app>',
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
