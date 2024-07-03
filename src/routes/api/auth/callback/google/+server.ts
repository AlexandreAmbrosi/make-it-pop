import oauth2Client from '@/lib/google/oauth2'
import { createCookie } from '@/lib/utils/auth'
import { webJson, webRedirect } from '@/lib/utils/web'
import type { RequestEvent } from './$types'
import { getLatestSession } from '../../session/latest'

export async function GET({ cookies, request }: RequestEvent) {
  const code = new URL(request.url).searchParams.get('code')
  try {
    if (!code) throw new Error('No code query param found.')
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)
    const userCall = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const userInfo = await userCall.json()
    // {
    //   verified_email: true,
    //   name: 'Rishi Raj Jain',
    //   email: 'jain71000@gmail.com',
    //   picture: 'https://lh3.googleusercontent.com/a/ACg8ocJ4yjSGVhWDjRAzx2YZ_RCQ-lADhqG7OmRwi2Hu2I2gZFM=s96-c',
    // }
    const { email, name, picture, verified_email } = userInfo
    const tmpSession = await getLatestSession(cookies, { email, name, picture, verified_email })
    const cookie = createCookie(tmpSession)
    cookies.set('custom_auth', cookie, { path: '/', httpOnly: true })
    return webRedirect('/api/email/verify/send', 302, {})
  } catch (e) {
    // @ts-ignore
    const message = e.message || e.toString()
    console.log(message)
    return webJson({ message }, 500, {})
  }
}
