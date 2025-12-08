import 'dotenv/config';
import pg from 'pg';

async function test() {
    const connectionString = process.env.POSTGRES_URL;
    console.log('Testing raw POSTGRES_URL...');

    const pool = new pg.Pool({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const client = await pool.connect();
        const res = await client.query('SELECT NOW()');
        console.log('Success!', res.rows[0]);
        client.release();
        await pool.end();
    } catch (e) {
        console.error('Connection failed:', e);
    }
}

test();
