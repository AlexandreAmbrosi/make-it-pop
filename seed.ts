import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './src/lib/db/schema';

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

// Mock Data
const toolsData = [
    { name: 'Linear', shortDescription: "The issue tracking tool you'll actually enjoy using.", url: 'https://linear.app', imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80', pricing: 'Freemium', tags: ['Productivity', 'Management'] },
    { name: 'Figma', shortDescription: 'The collaborative interface design tool.', url: 'https://figma.com', imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80', pricing: 'Freemium', tags: ['Design', 'UI/UX'] },
    { name: 'Supabase', shortDescription: 'The open source Firebase alternative.', url: 'https://supabase.com', imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', pricing: 'Free Tier', tags: ['Dev', 'Backend'] },
    { name: 'Midjourney', shortDescription: 'Generative AI program that creates images from natural language.', url: 'https://midjourney.com', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80', pricing: 'Paid', tags: ['AI', 'Generative'] },
];

const inspirationsData = [
    { title: 'Minimalist Branding', creatorName: 'Studio Koto', resourceUrl: '#', thumbnailUrl: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80', categories: ['Branding'] },
    { title: 'Neon Cyberpunk UI', creatorName: 'Mike D.', resourceUrl: '#', thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80', categories: ['UI/UX'] },
];

async function seed() {
    const rawUrl = process.env.POSTGRES_URL;
    if (!rawUrl) throw new Error('POSTGRES_URL is missing');

    const config = parseUrlToConfig(rawUrl);
    if (!config) throw new Error('Failed to parse URL');

    const pool = new pg.Pool(config);
    const db = drizzle(pool, { schema });

    console.log('Seeding database...');

    // 1. Ensure Boilerplate Tables
    console.log('Creating boilerplate tables if needed...');
    const client = await pool.connect();
    try {
        await client.query('CREATE TABLE IF NOT EXISTS tokens (email VARCHAR(255) PRIMARY KEY, code TEXT);');
        await client.query('CREATE TABLE IF NOT EXISTS access (email VARCHAR(255) PRIMARY KEY, code TEXT);');
        await client.query('CREATE TABLE IF NOT EXISTS login (email VARCHAR(255) PRIMARY KEY, password TEXT);');
        await client.query('CREATE TABLE IF NOT EXISTS waitlist (email VARCHAR(255) PRIMARY KEY);');
        await client.query('CREATE TABLE IF NOT EXISTS storage (key TEXT PRIMARY KEY, value TEXT);');
    } finally {
        client.release();
    }

    // 2. Seed Tools
    console.log('Seeding Tools...');
    for (const t of toolsData) {
        await db.insert(schema.tools).values({
            name: t.name,
            shortDescription: t.shortDescription,
            url: t.url,
            imageUrl: t.imageUrl,
            pricing: t.pricing,
            tags: t.tags,
            isActive: true
        });
    }

    // 3. Seed Inspirations
    console.log('Seeding Inspirations...');
    for (const i of inspirationsData) {
        await db.insert(schema.inspirations).values({
            resourceUrl: i.resourceUrl, // Required
            creatorName: i.creatorName,
            thumbnailUrl: i.thumbnailUrl,
            tags: i.categories,
            isActive: true
        });
    }

    // 4. Seed Course
    console.log('Seeding Courses...');
    try {
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

        if (course) {
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
                content: '# Introduction to UI Design\n\nWelcome to the course!...'
            });
        }
    } catch (e) {
        console.log('Course seeding skipped:', e.message);
    }

    // 5. Seed Glossary
    console.log('Seeding Glossary...');
    try {
        await db.insert(schema.glossaryTerms).values({
            term: 'Affordance',
            slug: 'affordance',
            shortDefinition: 'A property of an object that shows users how to interact with it.',
            longDefinition: 'In UI design, affordances are visual clues (like shadows, gradients, or button shapes) that suggest an element is clickable or interactive.'
        });
    } catch (e) {
        console.log('Glossary seeding skipped:', e.message);
    }

    console.log('Seeding completed.');
    await pool.end();
}

seed().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
