import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

async function testConnection() {
    const url = process.env.POSTGRES_URL;
    if (!url) {
        console.error('POSTGRES_URL is missing');
        return;
    }
    console.log('Testing connection with pg...');

    const pool = new Pool({
        connectionString: url,
        ssl: { rejectUnauthorized: false } // Common fix for some managed DBs
    });

    try {
        const client = await pool.connect();
        const res = await client.query('SELECT 1 as result');
        console.log('Connection successful:', res.rows[0]);
        client.release();
        await pool.end();
    } catch (error) {
        console.error('Connection failed:', error);
    }
}

testConnection();
