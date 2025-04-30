<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { useAsyncData, useRoute, useNuxtApp, createError, useHead } from '#app';
import { readItems } from '@directus/sdk';
import type { Page, PageBlock, BlockPost, Post } from '~~/shared/types/schema';
import PageBuilder from '~/components/PageBuilder.vue';
import { apply } from '@directus/visual-editing';

const route = useRoute();
const permalink = `/${[route.params.permalink].flat().join('/')}`;

const {
	data: pageData,
	error: pageError,
	refresh,
} = await useAsyncData<Page>(`page-data-${permalink}`, async () => {
	const { $directus } = useNuxtApp();

	try {
		const pageResult = await $directus.request(
			readItems('pages', {
				filter: { permalink: { _eq: permalink } },
				limit: 1,
				fields: [
					'title',
					'id',
					{
						seo: ['title', 'meta_description', 'og_image'],
						blocks: [
							'id',
							'background',
							'collection',
							'item',
							'sort',
							'hide_block',
							{
								item: {
									block_richtext: ['id', 'tagline', 'headline', 'content', 'alignment'],
									block_gallery: ['id', 'tagline', 'headline', { items: ['id', 'directus_file', 'sort'] }],
									block_pricing: [
										'id',
										'tagline',
										'headline',
										{
											pricing_cards: [
												'id',
												'title',
												'description',
												'price',
												'badge',
												'features',
												'is_highlighted',
												{
													button: [
														'id',
														'label',
														'variant',
														'url',
														'type',
														{ page: ['permalink'] },
														{ post: ['slug'] },
													],
												},
											],
										},
									],
									block_hero: [
										'id',
										'tagline',
										'headline',
										'description',
										'layout',
										'image',
										{
											button_group: [
												'id',
												{
													buttons: [
														'id',
														'label',
														'variant',
														'url',
														'type',
														{ page: ['permalink'] },
														{ post: ['slug'] },
													],
												},
											],
										},
									],
									block_posts: ['tagline', 'headline', 'collection', 'limit'],
									block_form: [
										'id',
										'tagline',
										'headline',
										{
											form: [
												'id',
												'title',
												'submit_label',
												'success_message',
												'on_success',
												'success_redirect_url',
												'is_active',
												{
													fields: [
														'id',
														'name',
														'type',
														'label',
														'placeholder',
														'help',
														'validation',
														'width',
														'choices',
														'required',
														'sort',
													],
												},
											],
										},
									],
								},
							},
						],
					},
				],
				deep: {
					blocks: { _sort: ['sort'], _filter: { hide_block: { _neq: true } } },
				},
			}),
		);

		if (!pageResult.length) {
			throw createError({ statusCode: 404, statusMessage: `Page not found ${permalink}` });
		}

		const page = pageResult[0] as Page;

		// Fetch posts for block_posts sections
		if (Array.isArray(page?.blocks)) {
			for (const block of page.blocks as PageBlock[]) {
				if (
					block.collection === 'block_posts' &&
					block.item &&
					typeof block.item !== 'string' &&
					'collection' in block.item &&
					block.item.collection === 'posts'
				) {
					const blockPost = block.item as BlockPost;
					const limit = blockPost.limit ?? 6;

					const posts: Post[] = await $directus.request<Post[]>(
						readItems('posts', {
							fields: ['id', 'title', 'description', 'slug', 'image', 'published_at'],
							filter: { status: { _eq: 'published' } },
							sort: ['-published_at'],
							limit,
						}),
					);

					// Assign fetched posts to the block item
					(block.item as BlockPost & { posts: Post[] }).posts = posts;
				}
			}
		}

		return page;
	} catch (err: any) {
		// Handle specific 404 error or throw a generic 500
		if (err.statusCode === 404) {
			throw err; // Re-throw the 404 error
		}

		throw createError({ statusCode: 500, statusMessage: 'Internal Server Error fetching page data' });
	}
});

// Handle potential errors from useAsyncData
if (pageError.value && !pageData.value) {
	// If an error occurred during fetch and we have no data, throw it
	// This ensures errors like 404 are properly handled by Nuxt's error page
	throw pageError.value;
}

const sections = computed(() => (pageData.value?.blocks as PageBlock[]) ?? []);

watchEffect(() => {
	if (pageData.value) {
		useHead({
			title: pageData.value?.title ?? '',
			meta: [
				{ property: 'og:title', content: pageData.value?.title || '' },
				{ property: 'og:url', content: `${import.meta.env.VITE_SITE_URL}${permalink}` },
			],
		});
	}
});

(function useVisualEditingTest() {
	if (!import.meta.client) return;

	const {
		public: { visualEditingTestEnv, testCase, directusUrl },
	} = useRuntimeConfig();

	if (!visualEditingTestEnv) return;

	if (testCase === 'refresh' || testCase === 'refresh-customized') {
		onMounted(() => {
			apply({ directusUrl, onSaved: () => refresh() });
		});
	}
})();
</script>

<template>
	<div>
		<PageBuilder :sections />
	</div>
</template>
