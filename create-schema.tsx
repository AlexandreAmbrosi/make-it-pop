import { type Client, createClient } from '@libsql/client'
import pg from 'pg'

const dbType = process.env.DATABASE_TYPE
const pgUrl = process.env.POSTGRES_URL
const sqliteUrl = process.env.SQLITE_URL
const sqliteToken = process.env.SQLITE_AUTH_TOKEN

let pool: pg.Pool
let sqlite: Client

if (dbType === 'pg') {
  if (!pgUrl) {
    throw new Error(`POSTGRES_URL environment variable is not set.`)
  } else {
    pool = new pg.Pool({ connectionString: pgUrl })
  }
} else if (dbType === 'sqlite') {
  if (!sqliteUrl || !sqliteToken) {
    throw new Error(`SQLITE_URL or SQLITE_AUTH_TOKEN environment variable is not set.`)
  } else {
    sqlite = createClient({ url: sqliteUrl, authToken: sqliteToken })
  }
}

async function createSchema() {
  if (dbType === 'pg') {
    await Promise.all([
      pool.query('CREATE TABLE IF NOT EXISTS tokens (email VARCHAR(255) PRIMARY KEY, code TEXT);'),
      pool.query('CREATE TABLE IF NOT EXISTS access (email VARCHAR(255) PRIMARY KEY, code TEXT);'),
      pool.query('CREATE TABLE IF NOT EXISTS emails_verified (email VARCHAR(255) PRIMARY KEY, code TEXT);'),
      pool.query('CREATE TABLE IF NOT EXISTS login (email VARCHAR(255) PRIMARY KEY, password TEXT);'),
      pool.query('CREATE TABLE IF NOT EXISTS waitlist (email VARCHAR(255) PRIMARY KEY);'),
      pool.query('CREATE TABLE IF NOT EXISTS user_info (email VARCHAR(255) PRIMARY KEY, name TEXT, image_ref TEXT)'),
    ])
    await pool.query('CREATE INDEX IF NOT EXISTS user_info_idx ON user_info (image_ref, name, email)')
    console.log('Postgres setup succesfully.')
    await pool.end()
  } else if (dbType === 'sqlite') {
    await Promise.all([
      sqlite.execute('CREATE TABLE IF NOT EXISTS tokens (email VARCHAR(255) PRIMARY KEY, code TEXT);'),
      sqlite.execute('CREATE TABLE IF NOT EXISTS access (email VARCHAR(255) PRIMARY KEY, code TEXT);'),
      sqlite.execute('CREATE TABLE IF NOT EXISTS emails_verified (email VARCHAR(255) PRIMARY KEY, code TEXT);'),
      sqlite.execute('CREATE TABLE IF NOT EXISTS login (email VARCHAR(255) PRIMARY KEY, password TEXT);'),
      sqlite.execute('CREATE TABLE IF NOT EXISTS waitlist (email VARCHAR(255) PRIMARY KEY);'),
      sqlite.execute('CREATE TABLE IF NOT EXISTS user_info (email VARCHAR(255) PRIMARY KEY, name TEXT, image_ref TEXT)'),
    ])
    console.log('SQLite setup succesfully.')
  }
}

createSchema()
