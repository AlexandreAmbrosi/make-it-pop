import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './src/lib/db/schema';
import 'dotenv/config';

async function main() {
    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) {
        console.error("POSTGRES_URL not found in env");
        process.exit(1);
    }

    console.log("Testing connection...");
    try {
        const client = postgres(connectionString);
        const db = drizzle(client, { schema });
        // Simple query
        await client`SELECT 1`;
        console.log("✅ Database connection successful!");
        process.exit(0);
    } catch (e) {
        console.error("❌ Database connection failed:", e);
        process.exit(1);
    }
}

main();
