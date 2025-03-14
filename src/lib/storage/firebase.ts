import firebaseConfig from '@/lib/storage/firebaseConfig'
import admin from 'firebase-admin'

type GetSignedUrlConfig = {
  version: 'v4'
  action: 'read' | 'write'
  expires: number
  contentType?: string
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      ...firebaseConfig,
      projectId: firebaseConfig.project_id,
      privateKey: firebaseConfig.private_key,
      clientEmail: firebaseConfig.client_email,
    }),
  })
}

const bucket = admin.storage().bucket(firebaseConfig.storageBucket)

async function ensureCORS() {
  await bucket.setCorsConfiguration([
    {
      maxAgeSeconds: 3600,
      method: ['PUT', 'POST', 'GET'],
      responseHeader: ['Content-Type', 'Content-MD5', 'Content-Disposition'],
      origin: ['http://localhost:3000', 'https://launchfast-sveltekit.vercel.app', 'https://launchfast-nextjs-ts.vercel.app', 'https://launchfast-astro-ts.vercel.app'],
    },
  ])
}

export async function getFirebaseObject(Key: string) {
  try {
    await ensureCORS()
    const urlOptions: GetSignedUrlConfig = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000,
    }
    const [url] = await bucket.file(Key).getSignedUrl(urlOptions)
    return url
  } catch (e: any) {
    const tmp = e.message || e.toString()
    console.log(tmp)
    return
  }
}

export async function uploadFirebaseObject(file: { name: string; type: string }) {
  try {
    await ensureCORS()
    const urlOptions: GetSignedUrlConfig = {
      version: 'v4',
      action: 'write',
      contentType: file.type,
      expires: Date.now() + 5 * 60 * 1000,
    }
    const [url] = await bucket.file(file.name).getSignedUrl(urlOptions)
    return url
  } catch (e: any) {
    const tmp = e.message || e.toString()
    console.log(tmp)
    return
  }
}
