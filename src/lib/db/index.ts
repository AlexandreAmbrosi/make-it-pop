import { building } from '$app/environment'
import { env } from '$env/dynamic/private'
import sqlite from '@/lib/db/sqlite'
import firebaseConfig from '@/lib/storage/firebaseConfig'
import { UnstorageAdapter } from '@auth/unstorage-adapter'
import admin from 'firebase-admin'
import { Db, MongoClient } from 'mongodb'
import postgres from 'postgres'
import type { RedisInstance } from 'redis-on-workers'
import { createRedis } from 'redis-on-workers'
import { createStorage, defineDriver } from 'unstorage'

let pool: postgres.Sql
let redis: RedisInstance
let mongoClient: MongoClient
let db: Db
let firestore: FirebaseFirestore.Firestore

const type = building ? null : env?.['DATABASE_TYPE'] || 'redis'

if (type === 'redis') {
  const connectionString = building ? null : env?.['REDIS_URL']
  if (connectionString) redis = createRedis(connectionString)
} else if (type === 'pg') {
  const connectionString = building ? null : env?.['POSTGRES_URL']
  if (connectionString) pool = postgres(connectionString)
} else if (type === 'firestore') {
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
  firestore = admin.firestore()
}

async function getMongoDB() {
  if (db) return
  const connectionString = env?.['MONGODB_URL']
  if (connectionString) {
    mongoClient = new MongoClient(connectionString)
    await mongoClient.connect()
    db = mongoClient.db(env?.['MONGODB_DB'] || 'launchfast')
  }
}

export const myStorageDriver = defineDriver(() => {
  return {
    name: 'launchfast-driver',
    async hasItem(key: string, _opts) {
      if (type === 'redis') {
        return !!(await redis.sendOnce('EXISTS', key))
      } else if (type === 'pg') {
        const rows = await pool`SELECT 1 FROM storage WHERE key = ${key}`
        return rows.length > 0
      } else if (type === 'sqlite') {
        const { rows } = await sqlite.execute({
          sql: 'SELECT 1 FROM storage WHERE key = ?',
          args: [key],
        })
        return rows.length > 0
      } else if (type === 'mongodb') {
        await getMongoDB()
        const count = await db.collection('storage').countDocuments({ key })
        return count > 0
      } else if (type === 'firestore') {
        const doc = await firestore.collection('storage').doc(key).get()
        return doc.exists
      }
      return false
    },
    async getItem(key: string, _opts) {
      if (type === 'redis') {
        return await redis.sendOnce('GET', key)
      } else if (type === 'pg') {
        const rows = await pool`SELECT value FROM storage WHERE key = ${key}`
        return rows[0]?.value
      } else if (type === 'sqlite') {
        const { rows } = await sqlite.execute({
          sql: 'SELECT value FROM storage WHERE key = ?',
          args: [key],
        })
        return rows[0]?.['value']
      } else if (type === 'mongodb') {
        await getMongoDB()
        const result = await db.collection('storage').findOne({ key })
        return result?.value
      } else if (type === 'firestore') {
        const doc = await firestore.collection('storage').doc(key).get()
        return doc.exists ? doc.data()?.value : null
      }
    },
    async setItem(key: string, value: any, _opts) {
      if (type === 'redis') {
        await redis.sendOnce('SET', key, value)
      } else if (type === 'pg') {
        await pool`
          INSERT INTO storage (key, value)
          VALUES (${key}, ${value})
          ON CONFLICT (key) DO UPDATE SET value = ${value}
        `
      } else if (type === 'sqlite') {
        await sqlite.execute({
          sql: 'INSERT INTO storage (key, value) VALUES (?, ?) ON CONFLICT (key) DO UPDATE SET value = ?',
          args: [key, value, value],
        })
      } else if (type === 'mongodb') {
        await getMongoDB()
        await db.collection('storage').updateOne({ key }, { $set: { value } }, { upsert: true })
      } else if (type === 'firestore') {
        await firestore.collection('storage').doc(key).set({ value }, { merge: true })
      }
    },
    async removeItem(key: string, _opts) {
      if (type === 'redis') {
        await redis.sendOnce('DEL', key)
      } else if (type === 'pg') {
        await pool`DELETE FROM storage WHERE key = ${key}`
      } else if (type === 'sqlite') {
        await sqlite.execute({
          sql: 'DELETE FROM storage WHERE key = ?',
          args: [key],
        })
      } else if (type === 'mongodb') {
        await getMongoDB()
        await db.collection('storage').deleteOne({ key })
      } else if (type === 'firestore') {
        await firestore.collection('storage').doc(key).delete()
      }
    },
    async getKeys(base: string, _opts) {
      if (type === 'redis') {
        return (await redis.sendOnce('KEYS', `${base}*`)) as string[]
      } else if (type === 'pg') {
        const rows = await pool`SELECT key FROM storage WHERE key LIKE ${base + '%'}`
        return rows.map((row) => row.key)
      } else if (type === 'sqlite') {
        const { rows } = await sqlite.execute({
          sql: 'SELECT key FROM storage WHERE key LIKE ?',
          args: [base + '%'],
        })
        return rows.map((row: any) => row['key'])
      } else if (type === 'mongodb') {
        await getMongoDB()
        const results = await db
          .collection('storage')
          .find({
            key: { $regex: `^${base}` },
          })
          .toArray()
        return results.map((doc) => doc.key)
      } else if (type === 'firestore') {
        const snapshot = await firestore
          .collection('storage')
          .where('key', '>=', base)
          .where('key', '<', base + '\uf8ff')
          .get()
        return snapshot.docs.map((doc) => doc.id)
      }
      return []
    },
    async clear(base: string, _opts) {
      if (type === 'redis') {
        const keys = (await redis.sendOnce('KEYS', `${base}*`)) as string[]
        if (keys.length) await redis.sendOnce('DEL', ...keys)
      } else if (type === 'pg') {
        await pool`DELETE FROM storage WHERE key LIKE ${base + '%'}`
      } else if (type === 'sqlite') {
        await sqlite.execute({
          sql: 'DELETE FROM storage WHERE key LIKE ?',
          args: [base + '%'],
        })
      } else if (type === 'mongodb') {
        await getMongoDB()
        await db.collection('storage').deleteMany({
          key: { $regex: `^${base}` },
        })
      } else if (type === 'firestore') {
        const snapshot = await firestore
          .collection('storage')
          .where('key', '>=', base)
          .where('key', '<', base + '\uf8ff')
          .get()
        await Promise.all(snapshot.docs.map((doc) => doc.ref.delete()))
      }
    },
    async dispose() {
      if (type === 'mongodb') {
        await mongoClient?.close()
      }
    },
  }
})

export const adapter = UnstorageAdapter(
  createStorage({
    driver: myStorageDriver(null),
  }),
)

export async function getAccess(email: string) {
  if (type === 'redis') {
    return await redis.sendOnce('HGET', 'access', email)
  } else if (type === 'pg') {
    const rows = await pool`SELECT code FROM access WHERE email = ${email}`
    return rows[0]?.code
  } else if (type === 'sqlite') {
    const { rows } = await sqlite.execute({
      sql: 'SELECT code FROM access WHERE email = ?',
      args: [email],
    })
    return rows[0]?.['code']
  } else if (type === 'mongodb') {
    await getMongoDB()
    const result = await db.collection('access').findOne({ email })
    return result?.['code']
  } else if (type === 'firestore') {
    const doc = await firestore.collection('access').doc(email).get()
    return doc.exists ? doc.data()?.code : null
  }
}

export async function setAccess(email: string, code: string) {
  if (type === 'redis') {
    return await redis.sendOnce('HSET', 'access', email, code)
  } else if (type === 'pg') {
    return await pool`
      INSERT INTO access (email, code) 
      VALUES (${email}, ${code}) 
      ON CONFLICT (email) DO UPDATE SET code = ${code}
    `
  } else if (type === 'sqlite') {
    return await sqlite.execute({
      sql: 'INSERT INTO access (email, code) VALUES (?, ?) ON CONFLICT (email) DO UPDATE SET code = ?',
      args: [email, code, code],
    })
  } else if (type === 'mongodb') {
    await getMongoDB()
    return await db.collection('access').updateOne({ email }, { $set: { code } }, { upsert: true })
  } else if (type === 'firestore') {
    return await firestore.collection('access').doc(email).set({ code }, { merge: true })
  }
}

export async function getCode(email: string) {
  if (type === 'redis') {
    return await redis.sendOnce('HGET', 'tokens', email)
  } else if (type === 'pg') {
    const rows = await pool`SELECT code FROM tokens WHERE email = ${email}`
    return rows[0]?.code
  } else if (type === 'sqlite') {
    const { rows } = await sqlite.execute({
      sql: 'SELECT code FROM tokens WHERE email = ?',
      args: [email],
    })
    return rows[0]?.['code']
  } else if (type === 'mongodb') {
    await getMongoDB()
    const result = await db.collection('tokens').findOne({ email })
    return result?.['code']
  } else if (type === 'firestore') {
    const doc = await firestore.collection('tokens').doc(email).get()
    return doc.exists ? doc.data()?.code : null
  }
}

export async function setCode(email: string, code: string) {
  if (type === 'redis') {
    return await redis.sendOnce('HSET', 'tokens', email, code)
  } else if (type === 'pg') {
    return await pool`
      INSERT INTO tokens (email, code) 
      VALUES (${email}, ${code}) 
      ON CONFLICT (email) DO UPDATE SET code = ${code}
    `
  } else if (type === 'sqlite') {
    return await sqlite.execute({
      sql: 'INSERT INTO tokens (email, code) VALUES (?, ?) ON CONFLICT (email) DO UPDATE SET code = ?',
      args: [email, code, code],
    })
  } else if (type === 'mongodb') {
    await getMongoDB()
    return await db.collection('tokens').updateOne({ email }, { $set: { code } }, { upsert: true })
  } else if (type === 'firestore') {
    return await firestore.collection('tokens').doc(email).set({ code }, { merge: true })
  }
}

export async function removeCode(email: string) {
  if (type === 'redis') {
    return await redis.sendOnce('HDEL', 'tokens', email)
  } else if (type === 'pg') {
    return await pool`DELETE FROM tokens WHERE email = ${email}`
  } else if (type === 'sqlite') {
    return await sqlite.execute({
      sql: 'DELETE FROM tokens WHERE email = ?',
      args: [email],
    })
  } else if (type === 'mongodb') {
    await getMongoDB()
    return await db.collection('tokens').deleteOne({ email })
  } else if (type === 'firestore') {
    return await firestore.collection('tokens').doc(email).delete()
  }
}

export async function setPassword(email: any, password: any) {
  if (type === 'redis') {
    return await redis.sendOnce('HSET', 'login', email, password)
  } else if (type === 'pg') {
    return await pool`
      INSERT INTO login (email, password) 
      VALUES (${email}, ${password}) 
      ON CONFLICT (email) DO UPDATE SET password = ${password}
    `
  } else if (type === 'sqlite') {
    return await sqlite.execute({
      sql: 'INSERT INTO login (email, password) VALUES (?, ?) ON CONFLICT (email) DO UPDATE SET password = ?',
      args: [email, password, password],
    })
  } else if (type === 'mongodb') {
    await getMongoDB()
    return await db.collection('login').updateOne({ email }, { $set: { password } }, { upsert: true })
  } else if (type === 'firestore') {
    return await firestore.collection('login').doc(email).set({ password }, { merge: true })
  }
}

export async function ifUserExists(email: string) {
  if (type === 'redis') {
    return await redis.sendOnce('HEXISTS', 'login', email)
  } else if (type === 'pg') {
    const rows = await pool`SELECT 1 FROM login WHERE email = ${email}`
    return rows.length
  } else if (type === 'sqlite') {
    const { rows } = await sqlite.execute({
      sql: 'SELECT 1 FROM login WHERE email = ?',
      args: [email],
    })
    return rows.length
  } else if (type === 'mongodb') {
    await getMongoDB()
    const count = await db.collection('login').countDocuments({ email })
    return count > 0
  } else if (type === 'firestore') {
    const doc = await firestore.collection('login').doc(email).get()
    return doc.exists
  }
}

export async function getPassword(email: string) {
  if (type === 'redis') {
    return await redis.sendOnce('HGET', 'login', email)
  } else if (type === 'pg') {
    const rows = await pool`SELECT password FROM login WHERE email = ${email}`
    return rows[0]?.password
  } else if (type === 'sqlite') {
    const { rows } = await sqlite.execute({
      sql: 'SELECT password FROM login WHERE email = ?',
      args: [email],
    })
    return rows[0]?.['password']
  } else if (type === 'mongodb') {
    await getMongoDB()
    const result = await db.collection('login').findOne({ email })
    return result?.['password']
  } else if (type === 'firestore') {
    const doc = await firestore.collection('login').doc(email).get()
    return doc.exists ? doc.data()?.password : null
  }
}

export async function setMailVerified(email: string, code: string) {
  if (type === 'redis') {
    return await redis.sendOnce('HSET', 'emails_verified', email, code)
  } else if (type === 'pg') {
    return await pool`
      INSERT INTO emails_verified (email, code) 
      VALUES (${email}, ${code}) 
      ON CONFLICT (email) DO UPDATE SET code = ${code}
    `
  } else if (type === 'sqlite') {
    return await sqlite.execute({
      sql: 'INSERT INTO emails_verified (email, code) VALUES (?, ?) ON CONFLICT (email) DO UPDATE SET code = ?',
      args: [email, code, code],
    })
  } else if (type === 'mongodb') {
    await getMongoDB()
    return await db.collection('emails_verified').updateOne({ email }, { $set: { code } }, { upsert: true })
  } else if (type === 'firestore') {
    return await firestore.collection('emails_verified').doc(email).set({ code }, { merge: true })
  }
}

export async function setUserImageRef(email: string, image_ref: string) {
  if (type === 'redis') {
    await redis.sendOnce('SET', `user:${email}:image_ref`, image_ref)
  } else if (type === 'pg') {
    return await pool`
      INSERT INTO user_info (email, image_ref) 
      VALUES (${email}, ${image_ref}) 
      ON CONFLICT (email) DO UPDATE SET image_ref = ${image_ref}
    `
  } else if (type === 'sqlite') {
    return await sqlite.execute({
      sql: 'INSERT INTO user_info (email, image_ref) VALUES (?, ?) ON CONFLICT (email) DO UPDATE SET image_ref = ?',
      args: [email, image_ref, image_ref],
    })
  } else if (type === 'mongodb') {
    await getMongoDB()
    return await db.collection('user_info').updateOne({ email }, { $set: { image_ref } }, { upsert: true })
  } else if (type === 'firestore') {
    return await firestore.collection('user_info').doc(email).set({ image_ref }, { merge: true })
  }
}

export async function setUserName(email: string, name: string) {
  if (type === 'redis') {
    await redis.sendOnce('SET', `user:${email}:name`, name)
  } else if (type === 'pg') {
    return await pool`
      INSERT INTO user_info (email, name) 
      VALUES (${email}, ${name}) 
      ON CONFLICT (email) DO UPDATE SET name = ${name}
    `
  } else if (type === 'sqlite') {
    return await sqlite.execute({
      sql: 'INSERT INTO user_info (email, name) VALUES (?, ?) ON CONFLICT (email) DO UPDATE SET name = ?',
      args: [email, name, name],
    })
  } else if (type === 'mongodb') {
    await getMongoDB()
    return await db.collection('user_info').updateOne({ email }, { $set: { name } }, { upsert: true })
  } else if (type === 'firestore') {
    return await firestore.collection('user_info').doc(email).set({ name }, { merge: true })
  }
}

export async function removeUser(email: string) {
  if (type === 'redis') {
    await Promise.all([redis.sendOnce('DEL', `user:${email}:name`), redis.sendOnce('DEL', `user:${email}:image_ref`)])
  } else if (type === 'pg') {
    return await Promise.all([
      pool`DELETE FROM user_info WHERE email = ${email}`,
      pool`DELETE FROM login WHERE email = ${email}`,
      pool`DELETE FROM tokens WHERE email = ${email}`,
      pool`DELETE FROM emails_verified WHERE email = ${email}`,
    ])
  } else if (type === 'sqlite') {
    return await Promise.all([
      sqlite.execute({
        sql: 'DELETE FROM user_info WHERE email = ?',
        args: [email],
      }),
      sqlite.execute({
        sql: 'DELETE FROM login WHERE email = ?',
        args: [email],
      }),
      sqlite.execute({
        sql: 'DELETE FROM tokens WHERE email = ?',
        args: [email],
      }),
      sqlite.execute({
        sql: 'DELETE FROM emails_verified WHERE email = ?',
        args: [email],
      }),
    ])
  } else if (type === 'mongodb') {
    await getMongoDB()
    return await Promise.all([
      db.collection('user_info').deleteOne({ email }),
      db.collection('login').deleteOne({ email }),
      db.collection('tokens').deleteOne({ email }),
      db.collection('emails_verified').deleteOne({ email }),
    ])
  } else if (type === 'firestore') {
    await Promise.all([
      firestore.collection('user_info').doc(email).delete(),
      firestore.collection('login').doc(email).delete(),
      firestore.collection('tokens').doc(email).delete(),
      firestore.collection('emails_verified').doc(email).delete(),
    ])
  }
}

export async function getUserImageRef(email: string) {
  if (type === 'redis') {
    await redis.sendOnce('GET', `user:${email}:image_ref`)
  } else if (type === 'pg') {
    const rows = await pool`SELECT image_ref FROM user_info WHERE email = ${email}`
    return rows[0]?.image_ref
  } else if (type === 'sqlite') {
    const { rows } = await sqlite.execute({
      sql: 'SELECT image_ref FROM user_info WHERE email = ?',
      args: [email],
    })
    return rows[0]?.['image_ref']
  } else if (type === 'mongodb') {
    await getMongoDB()
    const result = await db.collection('user_info').findOne({ email })
    return result?.['image_ref']
  } else if (type === 'firestore') {
    const doc = await firestore.collection('user_info').doc(email).get()
    return doc.exists ? doc.data()?.image_ref : null
  }
}

export async function getUserName(email: string) {
  if (type === 'redis') {
    await redis.sendOnce('GET', `user:${email}:name`)
  } else if (type === 'pg') {
    const rows = await pool`SELECT name FROM user_info WHERE email = ${email}`
    return rows[0]?.name
  } else if (type === 'sqlite') {
    const { rows } = await sqlite.execute({
      sql: 'SELECT name FROM user_info WHERE email = ?',
      args: [email],
    })
    return rows[0]?.['name']
  } else if (type === 'mongodb') {
    await getMongoDB()
    const result = await db.collection('user_info').findOne({ email })
    return result?.['name']
  } else if (type === 'firestore') {
    const doc = await firestore.collection('user_info').doc(email).get()
    return doc.exists ? doc.data()?.name : null
  }
}

export async function getUser(email: string) {
  if (type === 'redis') {
    const [name, image_ref] = (await redis.sendOnce('MGET', `user:${email}:name`, `user:${email}:image_ref`)) as { name?: string; image_ref?: string }[]
    return { name, image_ref }
  } else if (type === 'pg') {
    const rows = await pool`SELECT name, image_ref FROM user_info WHERE email = ${email}`
    return rows[0] as { name?: string; image_ref?: string }
  } else if (type === 'sqlite') {
    const { rows } = await sqlite.execute({
      sql: 'SELECT name, image_ref FROM user_info WHERE email = ?',
      args: [email],
    })
    return rows[0] as { name?: string; image_ref?: string }
  } else if (type === 'mongodb') {
    await getMongoDB()
    const result = await db.collection('user_info').findOne({ email })
    return { name: result?.['name'], image_ref: result?.['image_ref'] }
  } else if (type === 'firestore') {
    const doc = await firestore.collection('user_info').doc(email).get()
    return doc.exists ? { name: doc.data()?.name, image_ref: doc.data()?.image_ref } : null
  }
}

export async function addToWaitlist(email: string) {
  if (type === 'redis') {
    return await redis.sendOnce('RPUSH', 'waitlist', email)
  } else if (type === 'pg') {
    return await pool`
      INSERT INTO waitlist (email) 
      VALUES (${email}) 
      ON CONFLICT (email) DO NOTHING
    `
  } else if (type === 'sqlite') {
    return await sqlite.execute({
      sql: 'INSERT INTO waitlist (email) VALUES (?) ON CONFLICT (email) DO NOTHING',
      args: [email],
    })
  } else if (type === 'mongodb') {
    await getMongoDB()
    return await db.collection('waitlist').updateOne({ email }, { $setOnInsert: { email } }, { upsert: true })
  } else if (type === 'firestore') {
    return await firestore.collection('waitlist').doc(email).set({ email }, { merge: true })
  }
}
