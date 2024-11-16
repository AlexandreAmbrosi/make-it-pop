import { building } from '$app/environment'
import { env } from '$env/dynamic/private'

const SUPABASE_URL = building ? 'tmp_build_value' : env.SUPABASE_URL
const SUPABASE_ANON_KEY = building ? 'tmp_build_value' : env.SUPABASE_ANON_KEY
const SUPABASE_BUCKET_NAME = building ? 'tmp_build_value' : env.SUPABASE_BUCKET_NAME
const SUPABASE_BASE_STORAGE_API = `${SUPABASE_URL}/storage/v1`

const headers = new Headers()
headers.append('x-upsert', 'true')
headers.append('Content-Type', 'application/json')
headers.append('Authorization', `Bearer ${SUPABASE_ANON_KEY}`)

const body = JSON.stringify({ expiresIn: 60 * 60 })

export async function getSupabaseObject(objectPath: string) {
  try {
    const objectCall = await fetch(`${SUPABASE_BASE_STORAGE_API}/object/sign/${SUPABASE_BUCKET_NAME}/${objectPath}`, {
      body,
      headers,
      method: 'POST',
    })
    const objectResp = await objectCall.json()
    if (!objectCall.ok) throw new Error(JSON.stringify(objectResp))
    return [SUPABASE_BASE_STORAGE_API, objectResp.signedURL].join('')
  } catch (e: any) {
    const tmp = e.message || e.toString()
    console.log(tmp)
    return
  }
}

export async function uploadSupabaseObject(file: { name: string; type: string }) {
  try {
    const objectCall = await fetch(`${SUPABASE_BASE_STORAGE_API}/object/upload/sign/${SUPABASE_BUCKET_NAME}/${file.name}`, {
      body,
      headers,
      method: 'POST',
    })
    const objectResp = await objectCall.json()
    if (!objectCall.ok) throw new Error(JSON.stringify(objectResp))
    return [SUPABASE_BASE_STORAGE_API, objectResp.url].join('')
  } catch (e: any) {
    const tmp = e.message || e.toString()
    console.log(tmp)
    return
  }
}
