import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { Cookies } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { createHash, randomBytes } from 'node:crypto'
import { setPassword } from '../db'
import { webRedirect } from './web'

// Generate a random token
export function generateRandomToken() {
  return randomBytes(20).toString('hex')
}

// Generate a random string based on an input value
export function generateRandomString(inputValue: string) {
  return createHash('sha256').update(String(inputValue)).digest('hex')
}

// Hash a password using bcrypt
export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10)
}

// Compare a password with its hash using bcrypt
export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash)
}

// Create a JWT (JSON Web Token) cookie with an expiration of 1 hour
export function createCookie(body) {
  return jwt.sign(body, env.SECRET_KEY, { expiresIn: '1 hour' })
}

// Decode a JWT cookie
export function decodeJWTCookie(token: string) {
  try {
    return jwt.verify(token, env.SECRET_KEY)
  } catch (error) {
    return null
  }
}

// Get the user session based on a JWT cookie from a request
export function getSession(cookies: Cookies): { [k: string]: string | number } | null {
  try {
    const session = {}
    const authCookie = cookies.get('custom_auth')
    if (authCookie) {
      const decodedCookieValue = decodeJWTCookie(authCookie)
      if (decodedCookieValue && new Date(decodedCookieValue.exp * 1000).getTime() >= new Date().getTime()) {
        session['email'] = decodedCookieValue.email
        if (decodedCookieValue['name']) session['name'] = decodedCookieValue.name
        if (decodedCookieValue['picture']) session['picture'] = decodedCookieValue.picture
        if (decodedCookieValue['google']) session['google'] = decodedCookieValue.google
        if (decodedCookieValue['twitter']) session['twitter'] = decodedCookieValue.twitter
        return session
      }
    }
  } catch (e) {
    console.log(e)
  }
}

// Sign up a user by setting their password, creating a JWT cookie, and redirecting to an email send endpoint
export async function signUp(cookies: Cookies, email, password) {
  await setPassword(email, password)
  const cookie = createCookie({ email })
  cookies.set('custom_auth', cookie, { path: '/', httpOnly: true })
  return webRedirect('/api/email/verify/send', 302, {})
}
