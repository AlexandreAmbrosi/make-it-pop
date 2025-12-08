import 'dotenv/config';
import postgres from 'postgres';

async function createSchema() {
  let pgUrl = process.env.POSTGRES_URL;
  if (!pgUrl) throw new Error(`POSTGRES_URL environment variable is not set.`);
  pgUrl = pgUrl.trim().replace(/^['"]|['"]$/g, '');
  console.log('Using POSTGRES_URL:', pgUrl.replace(/:[^:]*@/, ':****@'));
  const pool = postgres(pgUrl);
  await Promise.all([
    pool`CREATE TABLE IF NOT EXISTS tokens (email VARCHAR(255) PRIMARY KEY, code TEXT);`,
    pool`CREATE TABLE IF NOT EXISTS access (email VARCHAR(255) PRIMARY KEY, code TEXT);`,
    pool`CREATE TABLE IF NOT EXISTS login (email VARCHAR(255) PRIMARY KEY, password TEXT);`,
    pool`CREATE TABLE IF NOT EXISTS waitlist (email VARCHAR(255) PRIMARY KEY);`,
    pool`CREATE TABLE IF NOT EXISTS storage (key TEXT PRIMARY KEY, value TEXT);`,
  ]);
  console.log('Postgres setup succesfully.');
  await pool.end();
}

createSchema();
