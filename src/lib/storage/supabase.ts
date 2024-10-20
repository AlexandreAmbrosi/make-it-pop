import { building } from '$app/environment'
import { env } from '$env/dynamic/private'

const SUPABASE_URL = building ? 'tmp_build_value' : env.SUPABASE_URL
const SUPABASE_ANON_KEY = building ? 'tmp_build_value' : env.SUPABASE_ANON_KEY
const SUPABASE_BUCKET_NAME = building ? 'tmp_build_value' : env.SUPABASE_BUCKET_NAME

export async function getSupabaseObject(objectPath: string) {
  try {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    headers.append('Authorization', `Bearer ${SUPABASE_ANON_KEY}`)
    const body = { expiresIn: 60 * 60 * 24 }
    const objectCall = await fetch(objectPath, {
      headers,
      method: 'POST',
      body: JSON.stringify(body),
    })
    const objectResp = await objectCall.json()
    return `${SUPABASE_URL}/storage/v1${objectResp.signedURL}`
  } catch (e: any) {
    const tmp = e.message || e.toString()
    console.log(tmp)
    return
  }
}

export async function uploadSupabaseObject(file: File) {
  try {
    const headers = new Headers()
    headers.append('x-upsert', 'true')
    headers.append('Content-Type', file.type)
    headers.append('Authorization', 'Bearer ' + SUPABASE_ANON_KEY)
    const objectCall = await fetch(`${SUPABASE_URL}/storage/v1/object/${SUPABASE_BUCKET_NAME}/${file.name}`, {
      headers,
      body: file,
      method: 'POST',
    })
    const objectResp = await objectCall.json()
    return `${SUPABASE_URL}/storage/v1/object/sign/${objectResp.Key}`
  } catch (e: any) {
    const tmp = e.message || e.toString()
    console.log(tmp)
    return
  }
}
