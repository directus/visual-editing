import type { Schema } from '~~/shared/types/schema';
import { createDirectus, readItems, rest, staticToken } from '@directus/sdk';
import type { SitemapUrlInput } from '#sitemap/types';

export async function getSitemapUrls(): Promise<Exclude<SitemapUrlInput, string>[]> {
	const { DIRECTUS_URL, DIRECTUS_SERVER_TOKEN } = import.meta.env;

	const directusServer = createDirectus<Schema>(DIRECTUS_URL).with(rest()).with(staticToken(DIRECTUS_SERVER_TOKEN));

	try {
		const pages = await directusServer.request(readItems('pages', { fields: ['permalink'] }));
		const posts = await directusServer.request(
			readItems('posts', { filter: { status: { _eq: 'published' } }, fields: ['slug'] }),
		);

		const pageUrls = pages.map((p) => ({ loc: `${p.permalink}` }));
		const postUrls = posts.map((p) => ({ loc: `/blog/${p.slug}` }));

		return [...pageUrls, ...postUrls];
	} catch {
		return [];
	}
}
