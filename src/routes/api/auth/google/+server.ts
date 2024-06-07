import oauth2Client from '@/lib/google/oauth2'
import { webRedirect } from '@/lib/utils/web'

export async function GET() {
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'openid email profile',
    prompt: 'consent',
  })
  return webRedirect(authorizationUrl, 302, {})
}
