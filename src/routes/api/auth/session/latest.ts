import { getUser } from '@/lib/db'
import { getFirebaseObject } from '@/lib/storage/firebase'
import { getS3Object } from '@/lib/storage/s3'
import { getSupabaseObject } from '@/lib/storage/supabase'
import { getSession } from '@/lib/utils/auth'
import { Cookies } from '@sveltejs/kit'

export async function getLatestSession(cookies: Cookies, existingSession?: Record<any, any>) {
  const session = existingSession ?? getSession(cookies)
  if (typeof session?.email !== 'string') return {}
  const user_details = await getUser(session.email)
  if (user_details) {
    const { image_ref, name } = user_details
    if (name?.length > 0) session['name'] = name
    if (image_ref?.length > 0) {
      let tmp
      if (image_ref.includes('storage.googleapis.com')) {
        tmp = await getFirebaseObject(image_ref)
      } else if (image_ref.includes('supabase.co')) {
        tmp = await getSupabaseObject(image_ref)
      } else if (image_ref.startsWith('s3_')) {
        tmp = await getS3Object(image_ref)
      }
      session['picture'] = tmp ?? image_ref
    }
  }
  return session
}
