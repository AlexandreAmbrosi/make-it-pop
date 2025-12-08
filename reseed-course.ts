import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './src/lib/db/schema';
import { eq } from 'drizzle-orm';

function parseUrlToConfig(url) {
    if (!url) throw new Error('No URL');
    // Strip quotes AND ALL WHITESPACE
    let clean = url.replace(/\s/g, '').replace(/^['"]|['"]$/g, '');

    const prefix = 'postgresql://';
    if (!clean.startsWith(prefix)) return null;

    const withoutPrefix = clean.substring(prefix.length);
    const lastAt = withoutPrefix.lastIndexOf('@');
    if (lastAt === -1) return null;

    const auth = withoutPrefix.substring(0, lastAt);
    const rest = withoutPrefix.substring(lastAt + 1);

    const firstColon = auth.indexOf(':');
    if (firstColon === -1) return null;

    const user = auth.substring(0, firstColon);
    const pass = auth.substring(firstColon + 1);

    const firstSlash = rest.indexOf('/');
    if (firstSlash === -1) return null;

    const hostPort = rest.substring(0, firstSlash);
    const dbNameParams = rest.substring(firstSlash + 1);

    let host = hostPort;
    let port = 5432;
    const colon = hostPort.lastIndexOf(':');
    if (colon !== -1) {
        host = hostPort.substring(0, colon);
        port = parseInt(hostPort.substring(colon + 1));
    }

    const qMark = dbNameParams.indexOf('?');
    const database = qMark === -1 ? dbNameParams : dbNameParams.substring(0, qMark);

    host = host.replace(/['"]/g, '');

    return {
        user,
        password: decodeURIComponent(pass),
        host,
        port,
        database,
        ssl: { rejectUnauthorized: false }
    };
}

async function reseed() {
    const rawUrl = process.env.POSTGRES_URL;
    if (!rawUrl) throw new Error('POSTGRES_URL is missing');

    const config = parseUrlToConfig(rawUrl);
    if (!config) throw new Error('Failed to parse URL');

    const pool = new pg.Pool(config);
    const db = drizzle(pool, { schema });

    console.log('Reseeding Course...');

    // 1. Delete existing course (Cascade should handle parts/chapters if configured, but let's be explicit or safe)
    // Note: Drizzle/PG refs usually restrict delete unless cascading. 
    // We will find the course by slug.

    try {
        const slug = 'ui-design-fundamentals';
        const existing = await db.select().from(schema.courses).where(eq(schema.courses.slug, slug));

        if (existing.length > 0) {
            const c = existing[0];
            console.log(`Deleting existing course: ${c.title} (${c.id})`);

            // Manual cascade delete because we didn't explicitly set ON DELETE CASCADE in schema definition (defaults to NO ACTION often)
            // Delete chapters -> parts -> course
            // Requires finding parts first.
            const parts = await db.select().from(schema.courseParts).where(eq(schema.courseParts.courseId, c.id));
            for (const p of parts) {
                await db.delete(schema.courseChapters).where(eq(schema.courseChapters.partId, p.id));
            }
            await db.delete(schema.courseParts).where(eq(schema.courseParts.courseId, c.id));
            await db.delete(schema.courses).where(eq(schema.courses.id, c.id));
            console.log('Cleanup complete.');
        }

        // 2. Re-insert
        console.log('Inserting fresh course data...');
        const [course] = await db.insert(schema.courses).values({
            title: 'UI Design Fundamentals',
            slug: 'ui-design-fundamentals',
            level: 'Beginner',
            duration: '4h 30m',
            description: 'Master the basics of user interface design.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?w=800&q=80',
            isPublished: true,
            skills: ['Figma', 'Typography', 'Color Theory']
        }).returning();

        const [part] = await db.insert(schema.courseParts).values({
            courseId: course.id,
            title: 'Getting Started',
            slug: 'getting-started',
            order: 1
        }).returning();

        await db.insert(schema.courseChapters).values({
            courseId: course.id,
            partId: part.id,
            title: 'Introduction',
            slug: 'intro',
            order: 1,
            content: '# Introduction to UI Design\n\nWelcome to the course! We will cover the basic principles of UI design including typography, color theory, and layout.\n\n## Tools\nWe will use Figma for all exercises.'
        });

        console.log('Course reseeded successfully!');

    } catch (e) {
        console.error('Reseed failed:', e);
    } finally {
        await pool.end();
    }
}

reseed();
