import '@dotenvx/dotenvx/config'
import sql from 'postgres'
import sqlite from './src/lib/db/sqlite'

async function createSchema() {
  const dbType = process.env.DATABASE_TYPE
  if (dbType === 'pg') {
    const pgUrl = process.env.POSTGRES_URL
    if (!pgUrl) throw new Error(`POSTGRES_URL environment variable is not set.`)
    const pool = sql(pgUrl)
    await Promise.all([
      pool`CREATE TABLE IF NOT EXISTS tokens (email VARCHAR(255) PRIMARY KEY, code TEXT);`,
      pool`CREATE TABLE IF NOT EXISTS access (email VARCHAR(255) PRIMARY KEY, code TEXT);`,
      pool`CREATE TABLE IF NOT EXISTS login (email VARCHAR(255) PRIMARY KEY, password TEXT);`,
      pool`CREATE TABLE IF NOT EXISTS waitlist (email VARCHAR(255) PRIMARY KEY);`,
      pool`CREATE TABLE IF NOT EXISTS storage (key TEXT PRIMARY KEY, value TEXT);`,
    ])
    console.log('Postgres setup succesfully.')
    await pool.end()
  } else if (dbType === 'sqlite') {
    await Promise.all([
      sqlite.execute({ sql: 'CREATE TABLE IF NOT EXISTS tokens (email VARCHAR(255) PRIMARY KEY, code TEXT);' }),
      sqlite.execute({ sql: 'CREATE TABLE IF NOT EXISTS access (email VARCHAR(255) PRIMARY KEY, code TEXT);' }),
      sqlite.execute({ sql: 'CREATE TABLE IF NOT EXISTS login (email VARCHAR(255) PRIMARY KEY, password TEXT);' }),
      sqlite.execute({ sql: 'CREATE TABLE IF NOT EXISTS waitlist (email VARCHAR(255) PRIMARY KEY);' }),
      sqlite.execute({ sql: `CREATE TABLE IF NOT EXISTS storage (key TEXT PRIMARY KEY, value TEXT);` }),
    ])
    console.log('SQLite setup succesfully.')
  }
}

createSchema()
