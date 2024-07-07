import bcrypt from 'bcryptjs'
import { createHash, randomBytes } from 'node:crypto'

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
