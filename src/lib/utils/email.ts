import { getEnv } from '@/lib/utils/env'

type EmailProvider = 'resend' | 'smtp2go' | 'postmark'

interface EmailBody {
  from: string
  to: string
  subject: string
  text: string
}

export async function sendEmail(body: EmailBody, provider?: EmailProvider) {
  const EMAIL_PROVIDER = provider || getEnv("EMAIL_PROVIDER")
  if (EMAIL_PROVIDER === 'resend') {
    const resendApiKey = getEnv("RESEND_API_KEY")
    // Send an email using Resend
    // Read more on https://resend.com/docs/api-reference/emails/send-email
    if (!resendApiKey) throw new Error(`RESEND_API_KEY environment variable not set.`)
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
    myHeaders.append('Authorization', `Bearer ${resendApiKey}`)
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        from: body.from, // "LaunchFast <contact@launchfa.st>"
        to: body.to.split(','),
        subject: body.subject,
        text: body.text,
      }),
    })
  } else if (EMAIL_PROVIDER === 'smtp2go') {
    const smtp2goApiKey = getEnv("SMTP2GO_API_KEY")
    if (!smtp2goApiKey) throw new Error(`SMTP2GO_API_KEY environment variable not set.`)
    // Send an email using smtp2go
    // https://developers.smtp2go.com/reference/send-standard-email-1
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
    myHeaders.append('X-Smtp2go-Api-Key', smtp2goApiKey)
    await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        sender: body.from, // "LaunchFast <contact@launchfa.st>"
        to: body.to.split(','),
        subject: body.subject,
        text_body: body.text,
      }),
    })
  } else if (EMAIL_PROVIDER === 'postmark') {
    const postmarkApiKey = getEnv("POSTMARK_API_KEY")
    if (!postmarkApiKey) throw new Error(`POSTMARK_API_KEY environment variable not set.`)
    // Send an email using Postmark
    // https://developers.cloudflare.com/workers/tutorials/send-emails-with-postmark/
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
    myHeaders.append('X-Postmark-Server-Token', postmarkApiKey)
    await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        From: body.from, // "LaunchFast <contact@launchfa.st>"
        To: body.to,
        Subject: body.subject,
        TextBody: body.text,
      }),
    })
  } else console.log(`The provider param or the process.env.EMAIL_PROVIDER failed to match the integrated providers.`)
}
