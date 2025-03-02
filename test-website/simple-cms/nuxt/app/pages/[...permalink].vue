<script setup lang="ts">
import { useAsyncData, useRoute } from '#app';
import PageBuilder from '~/components/PageBuilder.vue';
import { scan } from '@directus/visual-editing';

const route = useRoute();
const permalink = `/${(route.params.permalink || []).join('/')}`;

const {
	data: pageData,
	error: pageError,
	refresh,
} = await useAsyncData(`page-data-${permalink}`, () =>
	$fetch(`/api/page-data?permalink=${encodeURIComponent(permalink)}`),
);

if (!pageData.value && !pageError) {
	throw createError({ statusCode: 404, statusMessage: 'Page not found' });
}

const sections = computed(() => pageData.value?.blocks);

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
			scan({ directusUrl, onSaved: () => refresh() });
		});
	}
})();
</script>

<template>
	<div>
		<div v-if="pageError">404 - Page Not Found</div>
		<div v-else>
			<PageBuilder :sections />
		</div>
	</div>
</template>
