import { getUser, removeUser, setUserImageRef, setUserName } from '@/lib/db'
import { webJson, webResponse } from '@/lib/utils/web'
import type { RequestEvent } from './$types'

export async function POST({ locals, request }: RequestEvent) {
  // Check if the user is authenticated using the getSession function
  const tmpSession = await locals.auth()
  // If the user is not authenticated, return a 403 (Forbidden) response
  if (typeof tmpSession?.user?.email !== 'string') return webResponse('unauthenticated', 403, {})
  const userEmail = tmpSession.user?.email
  const session = await getUser(userEmail)
  try {
    const { name, image_ref, deleteAccount, message } = await request.json()
    if (image_ref?.length > 0 && deleteAccount !== true) {
      await setUserImageRef(userEmail, image_ref)
      return webJson({}, 200, {})
    }
    if (name?.length > 0 && deleteAccount !== true) {
      await setUserName(userEmail, name)
      return webJson({}, 200, {})
    }
    if (deleteAccount && message === 'delete my account' && name === session.name) {
      await removeUser(userEmail)
      //   await sendEmail({
      //     from: 'LaunchFa.st Demo <verification@launchfa.st>',
      //     to: userEmail,
      //     subject: '[LaunchFa.st]: Successful account deletion.',
      //     text: `Hello,\n\nYou have succesfully deleted your account on LaunchFa.st account associated with this email address (${userEmail}) successfully.\n\nThanks,\n\nLaunchFa.st`,
      //   })
      return webJson({ redirect: '/auth/signout' }, 200, {})
    }
    return webResponse(null, 200, {})
  } catch (e: any) {
    const tmp = e.message || e.toString()
    console.log(e)
    return webResponse(tmp, 500, {})
  }
}
