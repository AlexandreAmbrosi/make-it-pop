import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
import * as schema from './src/lib/db/schema';

function parseUrlToConfig(url) {
    if (!url) throw new Error('No URL');
    // Strip quotes AND ALL WHITESPACE (newlines etc)
    let clean = url.replace(/\s/g, '').replace(/^['"]|['"]$/g, '');

    const prefix = 'postgresql://';
    if (!clean.startsWith(prefix)) throw new Error('Invalid prefix');

    const withoutPrefix = clean.substring(prefix.length);
    const lastAt = withoutPrefix.lastIndexOf('@');
    if (lastAt === -1) throw new Error('No auth section');

    const auth = withoutPrefix.substring(0, lastAt);
    const rest = withoutPrefix.substring(lastAt + 1); // host:port/db

    const firstColon = auth.indexOf(':');
    if (firstColon === -1) throw new Error('No password in auth');

    const user = auth.substring(0, firstColon);
    const pass = auth.substring(firstColon + 1);

    // Host handling
    const firstSlash = rest.indexOf('/');
    if (firstSlash === -1) throw new Error('No database name');

    const hostPort = rest.substring(0, firstSlash);
    const dbNameParams = rest.substring(firstSlash + 1);

    // Host/Port
    let host = hostPort;
    let port = 5432;
    const colon = hostPort.lastIndexOf(':');
    if (colon !== -1) {
        host = hostPort.substring(0, colon);
        port = parseInt(hostPort.substring(colon + 1));
    }

    // Db Name
    const qMark = dbNameParams.indexOf('?');
    const database = qMark === -1 ? dbNameParams : dbNameParams.substring(0, qMark);

    // Remove quotes from host if any
    host = host.replace(/['"]/g, '');

    console.log(`Config: User=${user}, Host=${host}, Port=${port}, DB=${database}`);

    return {
        user,
        password: decodeURIComponent(pass),
        host,
        port,
        database,
        ssl: { rejectUnauthorized: false }
    };
}

async function main() {
    const rawUrl = process.env.POSTGRES_URL;
    if (!rawUrl) throw new Error('POSTGRES_URL is missing');

    let config;
    try {
        config = parseUrlToConfig(rawUrl);
    } catch (e) {
        console.error('Manual Parsing Failed:', e.message);
        process.exit(1);
    }

    console.log('Migration connecting...');
    const pool = new pg.Pool(config);

    const db = drizzle(pool, { schema });

    try {
        await migrate(db, { migrationsFolder: 'drizzle' });
        console.log('Migrations completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

main();
