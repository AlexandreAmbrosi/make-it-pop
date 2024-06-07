import pg from 'pg'
import { Redis } from 'ioredis'
import { env } from '$env/dynamic/private'

let pool: pg.Pool | null = null
let redis: Redis | null = null

const type = env?.['DATABASE_TYPE'] || 'redis'

if (type === 'redis') {
  const connectionString = env?.['REDIS_URL']
  if (connectionString) redis = new Redis(connectionString)
} else if (type === 'pg') {
  const connectionString = env?.['POSTGRES_URL']
  if (connectionString) pool = new pg.Pool({ connectionString })
}

export async function getAccess(email: string) {
  if (type === 'redis' && redis) {
    return await redis.hget('access', email)
  } else if (type === 'pg' && pool) {
    const { rows } = await pool.query({
      text: 'SELECT code FROM access WHERE email = $1',
      values: [email],
    })
    return rows[0]?.['code']
  }
}

export async function setAccess(email: string, code: string) {
  if (type === 'redis' && redis) {
    return await redis.hset('access', { [email]: code })
  } else if (type === 'pg' && pool) {
    return await pool.query({
      text: 'INSERT INTO access (email, code) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET code = $2',
      values: [email, code],
    })
  }
}

export async function getCode(email: string) {
  if (type === 'redis' && redis) {
    return await redis.hget('tokens', email)
  } else if (type === 'pg' && pool) {
    const { rows } = await pool.query({
      text: 'SELECT code FROM tokens WHERE email = $1',
      values: [email],
    })
    return rows[0]?.['code']
  }
}

export async function setCode(email: string, code: string) {
  if (type === 'redis' && redis) {
    return await redis.hset('tokens', { [email]: code })
  } else if (type === 'pg' && pool) {
    return await pool.query({
      text: 'INSERT INTO tokens (email, code) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET code = $2',
      values: [email, code],
    })
  }
}

export async function removeCode(email: string) {
  if (type === 'redis' && redis) {
    return await redis.hdel('tokens', email)
  } else if (type === 'pg' && pool) {
    return await pool.query({
      text: 'DELETE FROM tokens WHERE email = $1',
      values: [email],
    })
  }
}

// Set the password for a given email in Redis
export async function setPassword(email, password) {
  if (type === 'redis' && redis) {
    return await redis.hset('login', { [email]: password })
  } else if (type === 'pg' && pool) {
    return await pool.query({
      text: 'INSERT INTO login (email, password) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET password = $2',
      values: [email, password],
    })
  }
}

export async function getPassword(email) {
  if (type === 'redis' && redis) {
    return await redis.hget('login', email)
  } else if (type === 'pg' && pool) {
    const { rows } = await pool.query({
      text: 'SELECT password FROM login WHERE email = $1',
      values: [email],
    })
    return rows[0]?.['password']
  }
}

export async function setMailVerified(email: string, code: string) {
  if (type === 'redis' && redis) {
    return await redis.hset('emails_verified', { [email]: code })
  } else if (type === 'pg' && pool) {
    return await pool.query({
      text: 'INSERT INTO emails_verified (email, code) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET code = $2',
      values: [email, code],
    })
  }
}

export async function addToWaitlist(email: string) {
  if (type === 'redis' && redis) {
    return await redis.rpush('waitlist', email)
  } else if (type === 'pg' && pool) {
    return await pool.query({
      text: 'INSERT INTO waitlist (email) VALUES ($1) ON CONFLICT (email) DO NOTHING',
      values: [email],
    })
  }
}
