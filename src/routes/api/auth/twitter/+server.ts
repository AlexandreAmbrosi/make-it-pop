import { json } from '@sveltejs/kit'
import { authClient } from '@/lib/twitter/config'

export async function GET() {
  const authorizationUrl = authClient.generateAuthURL({
    state: 'state',
    code_challenge: 'challenge',
    code_challenge_method: 'plain',
  })
  return json(
    {},
    {
      status: 302,
      headers: {
        Location: authorizationUrl,
      },
    },
  )
}
