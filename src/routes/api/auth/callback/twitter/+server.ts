import { json, error } from '@sveltejs/kit'
import type { RequestEvent } from './$types'
import { createCookie } from '@/lib/utils/auth'
import { authClient, client } from '@/lib/twitter/config'

export async function GET(event: RequestEvent) {
  const code = new URL(event.request.url).searchParams.get('code')
  try {
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
    return json(
      {},
      {
        status: 302,
        headers: {
          Location: '/api/email/verify/send',
          'Set-Cookie': `custom_auth=${cookie}; Path=/; HttpOnly`,
        },
      },
    )
  } catch (e) {
    const err = e.message || e.toString()
    console.log(err)
    throw error(500, {
      message: err,
    })
  }
}
