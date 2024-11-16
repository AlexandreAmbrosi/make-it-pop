import { env } from '$env/dynamic/private'
import { getFirebaseObject, uploadFirebaseObject } from './firebase'
import { getS3Object, uploadS3Object } from './s3'
import { getSupabaseObject, uploadSupabaseObject } from './supabase'

const STORAGE_PROVIDER = env.STORAGE_PROVIDER

export default {
  retrieve: async (objectUrl: string) => {
    if (STORAGE_PROVIDER === 'firebase') return await getFirebaseObject(objectUrl)
    if (STORAGE_PROVIDER === 'supabase') return await getSupabaseObject(objectUrl)
    if (STORAGE_PROVIDER === 's3') return await getS3Object(objectUrl)
  },
  upload: async (file: { name: string; type: string }) => {
    if (STORAGE_PROVIDER === 'firebase') return await uploadFirebaseObject(file)
    if (STORAGE_PROVIDER === 'supabase') return await uploadSupabaseObject(file)
    if (STORAGE_PROVIDER === 's3') return await uploadS3Object(file)
  },
}
