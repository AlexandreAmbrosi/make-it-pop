import { initializeApp } from 'firebase/app'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import fireBaseConfig from './firebaseConfig'

export async function getFirebaseObject(objectUrl: string) {
  try {
    const app = initializeApp(fireBaseConfig)
    const storage = getStorage(app)
    const fileRef = ref(storage, objectUrl)
    return await getDownloadURL(fileRef)
  } catch (e: any) {
    const tmp = e.message || e.toString()
    console.log(tmp)
    return
  }
}

export async function uploadFirebaseObject(file: File) {
  try {
    // Initialize the Firebase app with the provided configuration
    const app = initializeApp(fireBaseConfig)
    // Get a reference to the Firebase Storage and parse the request data as a FormData object
    const storage = getStorage(app)
    // Generate a unique fileId (assuming uuidv4 is defined elsewhere)
    const fileId = uuidv4()
    // Create a reference to the Firebase Storage location where the file will be stored
    const storageRef = ref(storage, `uploads/${fileId}/${file.name}`)
    // Read the file as an array buffer
    const fileBuffer = await file.arrayBuffer()
    // Upload the file to Firebase Storage and retrieve metadata
    const { metadata } = await uploadBytes(storageRef, new Uint8Array(fileBuffer))
    const { fullPath } = metadata
    if (fullPath) return `https://storage.googleapis.com/${storageRef.bucket}/${storageRef.fullPath}`
  } catch (e: any) {
    const tmp = e.message || e.toString()
    console.log(tmp)
    return
  }
}
