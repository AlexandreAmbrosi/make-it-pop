import { Pool } from 'pg'

if (!process.env.POSTGRES_URL) throw new Error(`POSTGRES_URL environment variable is not set.`)

const pool = new Pool({ connectionString: process.env.POSTGRES_URL })

async function createSchema() {
  await Promise.all([
    pool.query('CREATE TABLE IF NOT EXISTS tokens (email VARCHAR(255) PRIMARY KEY, code TEXT);'),
    pool.query('CREATE TABLE IF NOT EXISTS access (email VARCHAR(255) PRIMARY KEY, code TEXT);'),
    pool.query('CREATE TABLE IF NOT EXISTS emails_verified (email VARCHAR(255) PRIMARY KEY, code TEXT);'),
    pool.query('CREATE TABLE IF NOT EXISTS login (email VARCHAR(255) PRIMARY KEY, password TEXT);'),
    pool.query('CREATE TABLE IF NOT EXISTS waitlist (email VARCHAR(255) PRIMARY KEY);'),
  ])
  console.log('Postgres setup succesfully.')
  await pool.end()
}

createSchema()
