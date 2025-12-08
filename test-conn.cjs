require('dotenv').config();
const { Pool } = require('pg');

async function test() {
    const url = process.env.POSTGRES_URL;
    if (!url) {
        console.log('No URL');
        return;
    }
    console.log('Testing with JS/pg...');

    const pool = new Pool({
        connectionString: url,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const client = await pool.connect();
        console.log('Connected!');
        const res = await client.query('SELECT 1');
        console.log('Result:', res.rows[0]);
        client.release();
        await pool.end();
    } catch (err) {
        console.error('Error:', err);
    }
}

test();
