import { authClient } from '@/lib/twitter/config'
import { webRedirect } from '@/lib/utils/web'

export async function GET() {
  const authorizationUrl = authClient.generateAuthURL({
    state: 'state',
    code_challenge: 'challenge',
    code_challenge_method: 'plain',
  })
  return webRedirect(authorizationUrl, 302, {})
}
