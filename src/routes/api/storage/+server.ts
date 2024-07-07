import storage from '@/lib/storage'
import { webJson } from '@/lib/utils/web'
import { error } from '@sveltejs/kit'
import type { RequestEvent } from './$types'

// Define an asynchronous function named GET that accepts a request object.
export async function GET(event: RequestEvent) {
  // Check if the user is authenticated using the getSession function
  const user = await event.locals.auth()
  // If the user is not authenticated, return a 403 (Forbidden) response
  if (!user?.user?.email) throw error(403)
  // Extract the 'file' parameter from the request URL.
  const url = new URL(event.request.url)
  const file = url.searchParams.get('file')
  // Check if the 'file' parameter exists in the URL.
  if (file) {
    try {
      const filePublicURL = await storage.retrieve(file)
      // Return a JSON response with the file's public URL and a 200 status code.
      return webJson({ filePublicURL }, 200, {})
    } catch (e) {
      // If an error occurs, log the error message and return a JSON response with a 500 status code.
      // @ts-ignore
      const message = error.message || error.toString()
      console.log(message)
      return webJson({ message }, 500, {})
    }
  }
  // If the 'file' parameter is not found in the URL, return a JSON response with a 400 status code.
  throw error(400, { message: 'Invalid Request.' })
}

// Define an asynchronous function to handle POST requests
export async function POST(event: RequestEvent) {
  // Check if the user is authenticated using the getSession function
  const user = await event.locals.auth()
  // If the user is not authenticated, return a 403 (Forbidden) response
  if (!user?.user?.email) throw error(403)
  // Check if the user has an email (an additional check for authentication)
  if (user.user.email) {
    const data = await event.request.formData()
    // Get the 'file' field from the form data
    const file = data.get('file')
    // Check if a file was provided
    if (!file) throw error(400, { message: 'No File Provided.' })
    // Check if the 'file' object is an instance of File (not necessary)
    if (!(file instanceof File)) throw error(400, { message: 'Uploaded file is not an instance of valid file.' })
    // Check if the file size exceeds the limit of 5 MB
    if (file.size > 5 * 1024 * 1024) throw error(400, { message: 'File size exceeds the limit of 5 MB.' })
    try {
      // Generate a non-publicly accessible URL for the uploaded file
      // Use this url to perform a GET to this endpoint with file query param valued as below
      const fileURL = await storage.upload(file)
      // Return a success response with a message
      return webJson({ message: 'Uploaded Successfully', fileURL }, 200, {})
    } catch (e) {
      // If there was an error during the upload process, return a 403 response with the error message
      // @ts-ignore
      const message = error.message || error.toString()
      console.log(message)
      return webJson({ message }, 403, {})
    }
  }
  // If the user doesn't have an email or there was an issue with authentication, return a 403 response
  throw error(403)
}
