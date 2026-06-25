'use server'
import { Resend } from 'resend'
import { contactSchema } from '@/lib/contact-schema'
export async function sendContact(
  _prev: { ok: boolean; error?: string },
  formData: FormData,
) {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, error: 'invalid' }
  if (parsed.data.website) return { ok: true } // honeypot tripped: pretend success
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: process.env.CONTACT_TO ?? 'dabinayo@pm.me',
      subject: `Portfolio message from ${parsed.data.name}`,
      replyTo: parsed.data.contact,
      text: parsed.data.message,
    })
    return { ok: true }
  } catch {
    return { ok: false, error: 'send' }
  }
}
