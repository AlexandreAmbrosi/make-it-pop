import { building } from '$app/environment'
import { env } from '$env/dynamic/private'
import firebaseConfig from '@/lib/storage/firebaseConfig'
import { type Client, createClient } from '@libsql/client'
import admin from 'firebase-admin'
import { Redis } from 'ioredis'
import { Db, MongoClient } from 'mongodb'
import pg from 'pg'

let pool: pg.Pool
let redis: Redis
let mongoClient: MongoClient
let db: Db
let sqlite: Client
let firestore: FirebaseFirestore.Firestore

const type = building ? null : env?.['DATABASE_TYPE'] || 'redis'

if (type === 'redis') {
  const connectionString = building ? null : env?.['REDIS_URL']
  if (connectionString) redis = new Redis(connectionString)
} else if (type === 'pg') {
  const connectionString = building ? null : env?.['POSTGRES_URL']
  if (connectionString) pool = new pg.Pool({ connectionString })
} else if (type === 'sqlite') {
  const connectionString = building ? null : env?.['SQLITE_URL']
  const connectionToken = building ? 'tmp_build_value' : env?.['SQLITE_AUTH_TOKEN']
  if (connectionString) sqlite = createClient({ url: connectionString, authToken: connectionToken })
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

export async function getAccess(email: string) {
  if (type === 'redis') {
    return await redis.hget('access', email)
  } else if (type === 'pg') {
    const { rows } = await pool.query({
      text: 'SELECT code FROM access WHERE email = $1',
      values: [email],
    })
    return rows[0]?.['code']
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
    return await redis.hset('access', { [email]: code })
  } else if (type === 'pg') {
    return await pool.query({
      text: 'INSERT INTO access (email, code) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET code = $2',
      values: [email, code],
    })
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
    return await redis.hget('tokens', email)
  } else if (type === 'pg') {
    const { rows } = await pool.query({
      text: 'SELECT code FROM tokens WHERE email = $1',
      values: [email],
    })
    return rows[0]?.['code']
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
    return await redis.hset('tokens', { [email]: code })
  } else if (type === 'pg') {
    return await pool.query({
      text: 'INSERT INTO tokens (email, code) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET code = $2',
      values: [email, code],
    })
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
    return await redis.hdel('tokens', email)
  } else if (type === 'pg') {
    return await pool.query({
      text: 'DELETE FROM tokens WHERE email = $1',
      values: [email],
    })
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
    return await redis.hset('login', { [email]: password })
  } else if (type === 'pg') {
    return await pool.query({
      text: 'INSERT INTO login (email, password) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET password = $2',
      values: [email, password],
    })
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
    return await redis.hexists('login', email)
  } else if (type === 'pg') {
    const { rowCount } = await pool.query({
      text: 'SELECT 1 FROM login WHERE email = $1',
      values: [email],
    })
    return rowCount
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
    return await redis.hget('login', email)
  } else if (type === 'pg') {
    const { rows } = await pool.query({
      text: 'SELECT password FROM login WHERE email = $1',
      values: [email],
    })
    return rows[0]?.['password']
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
    return await redis.hset('emails_verified', { [email]: code })
  } else if (type === 'pg') {
    return await pool.query({
      text: 'INSERT INTO emails_verified (email, code) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET code = $2',
      values: [email, code],
    })
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
    await redis.set(`user:${email}:image_ref`, image_ref)
  } else if (type === 'pg') {
    return await pool.query({
      text: 'INSERT INTO user_info (email, image_ref) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET image_ref = $2',
      values: [email, image_ref],
    })
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
    await redis.set(`user:${email}:name`, name)
  } else if (type === 'pg') {
    return await pool.query({
      text: 'INSERT INTO user_info (email, name) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET name = $2',
      values: [email, name],
    })
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
    await Promise.all([redis.del(`user:${email}:name`), redis.del(`user:${email}:image_ref`)])
  } else if (type === 'pg') {
    return await Promise.all([
      pool.query({
        text: 'DELETE FROM user_info WHERE email = $1',
        values: [email],
      }),
      pool.query({
        text: 'DELETE FROM login WHERE email = $1',
        values: [email],
      }),
      pool.query({
        text: 'DELETE FROM tokens WHERE email = $1',
        values: [email],
      }),
      pool.query({
        text: 'DELETE FROM emails_verified WHERE email = $1',
        values: [email],
      }),
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
    await redis.get(`user:${email}:image_ref`)
  } else if (type === 'pg') {
    const { rows } = await pool.query({
      text: 'SELECT image_ref FROM user_info WHERE email = $1',
      values: [email],
    })
    return rows[0]?.['image_ref']
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
    await redis.get(`user:${email}:name`)
  } else if (type === 'pg') {
    const { rows } = await pool.query({
      text: 'SELECT name FROM user_info WHERE email = $1',
      values: [email],
    })
    return rows[0]?.['name']
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
    const [name, image_ref] = await redis.mget(`user:${email}:name`, `user:${email}:image_ref`)
    return { name, image_ref }
  } else if (type === 'pg') {
    const { rows } = await pool.query({
      text: 'SELECT name, image_ref FROM user_info WHERE email = $1',
      values: [email],
    })
    return rows[0]
  } else if (type === 'sqlite') {
    const { rows } = await sqlite.execute({
      sql: 'SELECT name, image_ref FROM user_info WHERE email = ?',
      args: [email],
    })
    return rows[0]
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
    return await redis.rpush('waitlist', email)
  } else if (type === 'pg') {
    return await pool.query({
      text: 'INSERT INTO waitlist (email) VALUES ($1) ON CONFLICT (email) DO NOTHING',
      values: [email],
    })
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
