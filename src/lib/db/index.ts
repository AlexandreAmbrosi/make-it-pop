import { env } from '$env/dynamic/private'
import { Redis } from 'ioredis'
import pg from 'pg'

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
export async function setPassword(email: any, password: any) {
  if (type === 'redis' && redis) {
    return await redis.hset('login', { [email]: password })
  } else if (type === 'pg' && pool) {
    return await pool.query({
      text: 'INSERT INTO login (email, password) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET password = $2',
      values: [email, password],
    })
  }
}

export async function ifUserExists(email: string) {
  if (type === 'redis' && redis) {
    return await redis.hexists('login', email)
  } else if (type === 'pg' && pool) {
    const { rowCount } = await pool.query({
      text: 'SELECT 1 FROM login WHERE email = $1',
      values: [email],
    })
    return rowCount
  }
}

export async function getPassword(email: string) {
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

export async function setUserImageRef(email: string, image_ref: string) {
  if (type === 'redis' && redis) {
    await redis.set(`user:${email}:image_ref`, image_ref)
  } else if (type === 'pg' && pool) {
    return await pool.query({
      text: 'INSERT INTO user_info (email, image_ref) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET image_ref = $2',
      values: [email, image_ref],
    })
  }
}

export async function setUserName(email: string, name: string) {
  if (type === 'redis' && redis) {
    await redis.set(`user:${email}:name`, name)
  } else if (type === 'pg' && pool) {
    return await pool.query({
      text: 'INSERT INTO user_info (email, name) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET name = $2',
      values: [email, name],
    })
  }
}

export async function removeUser(email: string) {
  if (type === 'redis' && redis) {
    await Promise.all([redis.del(`user:${email}:name`), redis.del(`user:${email}:image_ref`)])
  } else if (type === 'pg' && pool) {
    return await Promise.all([
      pool.query({
        text: 'DELETE FROM user_info WHERE email = $1',
        values: [email],
      }),
      pool.query({
        text: 'DELETE FROM login WHERE email = $1',
        values: [email],
      }),
    ])
  }
}

export async function getUserImageRef(email: string) {
  if (type === 'redis' && redis) {
    await redis.get(`user:${email}:image_ref`)
  } else if (type === 'pg' && pool) {
    const { rows } = await pool.query({
      text: 'SELECT image_ref FROM user_info WHERE email = $1',
      values: [email],
    })
    return rows[0]?.['image_ref']
  }
}

export async function getUserName(email: string) {
  if (type === 'redis' && redis) {
    await redis.get(`user:${email}:name`)
  } else if (type === 'pg' && pool) {
    const { rows } = await pool.query({
      text: 'SELECT name FROM user_info WHERE email = $1',
      values: [email],
    })
    return rows[0]?.['name']
  }
}

export async function getUser(email: string) {
  if (type === 'redis' && redis) {
    const [name, image_ref] = await redis.mget(`user:${email}:name`, `user:${email}:image_ref`)
    return { name, image_ref }
  } else if (type === 'pg' && pool) {
    const { rows } = await pool.query({
      text: 'SELECT name, image_ref FROM user_info WHERE email = $1',
      values: [email],
    })
    return rows[0]
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
