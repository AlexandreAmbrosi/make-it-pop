import { db } from '$lib/db/drizzle';
import { glossaryTerms } from '$lib/db/schema';
import { desc, ilike, or, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const query = url.searchParams.get('q');

    let filters = [];

    if (query) {
        filters.push(or(
            ilike(glossaryTerms.term, `%${query}%`),
            ilike(glossaryTerms.shortDefinition, `%${query}%`)
        ));
    }

    try {
        const data = await db.select().from(glossaryTerms)
            .where(and(...filters))
            .orderBy(desc(glossaryTerms.term));

        return {
            terms: data
        };
    } catch (e) {
        console.error('Glossary Load Error:', e);
        return { terms: [] };
    }
};
