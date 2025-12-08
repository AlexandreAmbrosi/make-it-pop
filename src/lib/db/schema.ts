
import { pgTable, text, timestamp, boolean, uuid, integer, jsonb, primaryKey } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Enums
// categories: 'Design', 'Productivity', 'No-code', etc.
// pricing: 'free', 'paid', 'freemium'

export const tools = pgTable('tools', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    shortDescription: text('short_description').notNull(),
    url: text('url').notNull(),
    imageUrl: text('image_url'),
    pricing: text('pricing'), // free, paid, freemium
    metadata: jsonb('metadata'), // flexible extras
    tags: text('tags').array(),
    sourceInfo: jsonb('source_info'), // original link, email, etc.
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const inspirations = pgTable('inspirations', {
    id: uuid('id').defaultRandom().primaryKey(),
    creatorName: text('creator_name'),
    projectDate: timestamp('project_date'),
    thumbnailUrl: text('thumbnail_url'),
    resourceUrl: text('resource_url').notNull(),
    tags: text('tags').array(),
    metadata: jsonb('metadata'),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const courses = pgTable('courses', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    domain: text('domain'), // UX Design, etc.
    level: text('level'), // beginner, intermediate, expert
    duration: text('duration'), // e.g. "4 hours"
    thumbnailUrl: text('thumbnail_url'),
    description: text('description'),
    usps: jsonb('usps'), // Array of {icon, text}
    skills: text('skills').array(),
    isPublished: boolean('is_published').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const courseParts = pgTable('course_parts', {
    id: uuid('id').defaultRandom().primaryKey(),
    courseId: uuid('course_id').references(() => courses.id).notNull(),
    title: text('title').notNull(),
    slug: text('slug').notNull(),
    order: integer('order').notNull(), // 1, 2, 3...
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const courseChapters = pgTable('course_chapters', {
    id: uuid('id').defaultRandom().primaryKey(),
    courseId: uuid('course_id').references(() => courses.id).notNull(), // Redundant but useful for quick queries
    partId: uuid('part_id').references(() => courseParts.id).notNull(),
    title: text('title').notNull(),
    slug: text('slug').notNull(),
    content: text('content'), // Markdown/HTML content
    order: integer('order').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const glossaryTerms = pgTable('glossary_terms', {
    id: uuid('id').defaultRandom().primaryKey(),
    term: text('term').notNull(),
    slug: text('slug').notNull().unique(),
    shortDefinition: text('short_definition').notNull(),
    longDefinition: text('long_definition'),
    relatedTermIds: text('related_term_ids').array(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const favorites = pgTable('favorites', {
    userId: text('user_id').notNull(), // Email from the auth system
    itemId: uuid('item_id').notNull(),
    itemType: text('item_type').notNull(), // 'tool' | 'inspiration'
    createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
    pk: primaryKey({ columns: [t.userId, t.itemId] }),
}));

export const articles = pgTable('articles', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    content: text('content'), // Markdown/MDX
    author: text('author').default('Make It Pop Team'),
    imageUrl: text('image_url'),
    isPublished: boolean('is_published').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});

// Auth & Storage Tables (Required for Custom Adapter)
export const storage = pgTable('storage', {
    key: text('key').primaryKey(),
    value: text('value'), // Unstorage value
});

export const userInfo = pgTable('user_info', {
    email: text('email').primaryKey(),
    name: text('name'),
    imageRef: text('image_ref'),
});

export const login = pgTable('login', {
    email: text('email').primaryKey(),
    password: text('password'),
});

export const tokens = pgTable('tokens', {
    email: text('email').primaryKey(),
    code: text('code'),
});

export const access = pgTable('access', {
    email: text('email').primaryKey(),
    code: text('code'),
});

export const emailsVerified = pgTable('emails_verified', {
    email: text('email').primaryKey(),
    code: text('code'),
});

export const waitlist = pgTable('waitlist', {
    email: text('email').primaryKey(),
});

