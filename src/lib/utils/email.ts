import { env } from '$env/dynamic/private'

interface EmailBody {
  from: string
  to: string
  subject: string
  text: string
}

type EmailProvider = 'resend' | 'nodemailer'

export async function sendEmail(body: EmailBody, provider?: EmailProvider) {
  const EMAIL_PROVIDER = provider ?? env?.EMAIL_PROVIDER ?? 'resend'
  if (EMAIL_PROVIDER === 'resend') {
    // Send an email using Resend
    // Read more on https://resend.com/docs/api-reference/emails/send-email
    const resend = (await import('../email/resend')).default
    await resend?.emails.send(body)
  } else if (EMAIL_PROVIDER === 'nodemailer') {
    // Send an email using nodemailer
    // https://www.smtp2go.com/setupguide/node-js-script/
    const nodemailer = (await import('nodemailer')).default
    const smtpTransport = nodemailer.createTransport({
      host: 'mail.smtp2go.com',
      auth: {
        user: process.env.SMTP2GO_USERNAME,
        pass: process.env.SMTP2GO_PASSWORD,
      },
      port: 2525, // 8025, 587 and 25 can also be used.
    })
    await smtpTransport.sendMail(body)
  }
}
