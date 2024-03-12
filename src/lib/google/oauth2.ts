import { google } from 'googleapis'
import { env } from '$env/dynamic/private'

export default new google.auth.OAuth2(env.GOOGLE_AUTH_ID, env.GOOGLE_AUTH_SECRET, env.GOOGLE_AUTH_CALLBACK_URL)
