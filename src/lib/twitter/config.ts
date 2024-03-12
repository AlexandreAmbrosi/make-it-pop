import { env } from '$env/dynamic/private'
import { Client, auth } from 'twitter-api-sdk'

export const authClient = new auth.OAuth2User({
  client_id: env.TWITTER_CLIENT_ID,
  callback: env.TWITTER_AUTH_CALLBACK_URL,
  client_secret: env.TWITTER_CLIENT_SECRET,
  scopes: ['tweet.write', 'tweet.read', 'offline.access', 'users.read'],
})

export const client = new Client(authClient)
