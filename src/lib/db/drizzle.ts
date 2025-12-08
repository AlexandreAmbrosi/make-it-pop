
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

const connectionString = env.POSTGRES_URL;

if (!connectionString) {
    // Avoid throwing at module root to prevent app crash if env is missing
    console.error('CRITICAL: POSTGRES_URL is not set. Database features will fail.');
}

const pool = new pg.Pool({
    connectionString: connectionString || 'postgres://placeholder:5432/db', // Placeholder to allow startup
    ssl: { rejectUnauthorized: false }
});

export const db = drizzle(pool, { schema });
