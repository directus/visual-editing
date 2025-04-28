<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useNuxtApp } from '#app';
import { useDebounceFn } from '@vueuse/core';
import { Search } from 'lucide-vue-next';
import { readItems } from '@directus/sdk';
import type { Page, Post } from '~~/shared/types/schema'; // Assuming types are here

type SearchResult = {
	id: string;
	title: string;
	description: string;
	type: string;
	link: string;
	content: string;
};

const open = ref(false);
const results = ref<SearchResult[]>([]);
const loading = ref(false);
const searched = ref(false);
const router = useRouter();
const { $directus } = useNuxtApp();

const fetchResults = async (search: string) => {
	if (search.length < 3) {
		results.value = [];
		searched.value = false;
		return;
	}

	loading.value = true;
	searched.value = true;

	try {
		// Explicitly type the results from Promise.all
		const [pages, posts] = (await Promise.all([
			$directus.request(
				readItems('pages', {
					filter: {
						_or: [
							{ title: { _contains: search } },
							{ description: { _contains: search } },
							{ permalink: { _contains: search } },
						],
					},
					fields: ['id', 'title', 'description', 'permalink'],
				}),
			),
			$directus.request(
				readItems('posts', {
					filter: {
						_and: [
							{ status: { _eq: 'published' } }, // Ensure only published posts are searched client-side
							{
								_or: [
									{ title: { _contains: search } },
									{ description: { _contains: search } },
									{ slug: { _contains: search } },
									{ content: { _contains: search } },
								],
							},
						],
					},
					fields: ['id', 'title', 'description', 'slug', 'content', 'status'],
				}),
			),
		])) as [Page[], Post[]]; // Assert the types here

		const combinedResults: SearchResult[] = [
			...pages.map((page) => ({
				id: page.id,
				title: page.title ?? '',
				description: page.description ?? '',
				type: 'Page',
				link: `/${page.permalink?.replace(/^\/+/, '') ?? ''}`,
				content: '', // Pages don't have searchable content field here
			})),
			...posts.map((post) => ({
				id: post.id,
				title: post.title ?? '',
				description: post.description ?? '',
				type: 'Post',
				link: `/blog/${post.slug ?? ''}`,
				content: post.content ?? '',
			})),
		];

		results.value = combinedResults;
		await nextTick();
	} catch (error) {
		console.error('Search failed:', error); // Log error for debugging
		results.value = [];
	} finally {
		loading.value = false;
	}
};

const debouncedFetchResults = useDebounceFn(fetchResults, 300);

onMounted(() => {
	const onKeyDown = (e: KeyboardEvent) => {
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			open.value = !open.value;
		}
	};

	window.addEventListener('keydown', onKeyDown);
	return () => window.removeEventListener('keydown', onKeyDown);
});

watch(open, (isOpen) => {
	if (!isOpen) {
		results.value = [];
		searched.value = false;
		loading.value = false;
	}
});
</script>

<template>
	<div class="sm:max-w-[540px] max-w-full">
		<Button variant="ghost" size="icon" aria-label="Search" @click="open = true">
			<Search class="size-5" />
		</Button>

		<CommandDialog v-model:open="open">
			<Command>
				<DialogTitle class="p-2 sr-only">Search</DialogTitle>
				<DialogDescription class="px-2 sr-only">Search for pages or posts</DialogDescription>

				<CommandInput
					placeholder="Search for pages or posts"
					class="m-2 p-4 focus:outline-none text-base leading-normal"
					@input="(e) => debouncedFetchResults(e.target.value)"
				/>

				<CommandList class="p-2 text-foreground max-h-[500px] overflow-auto">
					<CommandEmpty v-if="!loading && !searched" class="py-2 text-sm text-center">
						Enter a search term above to see results
					</CommandEmpty>
					<CommandEmpty v-if="loading" class="py-2 text-sm text-center">Loading...</CommandEmpty>
					<CommandEmpty v-if="!loading && searched && results.length === 0" class="py-2 text-sm text-center">
						No results found
					</CommandEmpty>
					<CommandGroup v-if="!loading && results.length > 0" heading="Search Results" class="pt-2">
						<CommandItem
							v-for="result in results"
							:key="result.id"
							class="flex items-start gap-4 px-2 py-3"
							:value="`${result.title} ${result.description} ${result.type} ${result.link} ${result.content}`"
							@select="
								router.push(result.link);
								open = false;
							"
						>
							<Badge variant="default">{{ result.type }}</Badge>
							<div class="ml-2 w-full">
								<p class="font-medium text-base">{{ result.title }}</p>
								<p v-if="result.description" class="text-sm mt-1 line-clamp-2">{{ result.description }}</p>
							</div>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>
		</CommandDialog>
	</div>
</template>
