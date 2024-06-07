import { authClient, client } from '@/lib/twitter/config'
import { createCookie } from '@/lib/utils/auth'
import { webJson, webRedirect } from '@/lib/utils/web'
import type { RequestEvent } from './$types'

export async function GET({ cookies, request }: RequestEvent) {
  const code = new URL(request.url).searchParams.get('code')
  try {
    if (!code) throw new Error('No code query param found.')
    authClient.generateAuthURL({
      state: 'state',
      code_challenge: 'challenge',
      code_challenge_method: 'plain',
    })
    await authClient.requestAccessToken(code)
    const { data: userInfo } = await client.users.findMyUser({
      'user.fields': ['profile_image_url', 'name'],
    })
    // {
    //   data: {
    //     profile_image_url: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
    //     username: 'launch_fast_',
    //     id: '1765648321287180288',
    //     name: 'LaunchFa.st Support'
    //   }
    // }
    const { name, profile_image_url: picture } = userInfo
    const cookie = createCookie({ name, picture, twitter: 1 })
    cookies.set('custom_auth', cookie, { path: '/', httpOnly: true })
    return webRedirect('/api/email/verify/send', 302, {})
  } catch (e) {
    const message = e.message || e.toString()
    return webJson({ message }, 500, {})
  }
}
