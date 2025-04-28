<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRuntimeConfig, useNuxtApp } from '#app';
import { readMe } from '@directus/sdk';
import directusLogo from '~/assets/images/directus-logo-white.svg';

const props = defineProps({
	content: {
		type: Object,
		required: true,
	},
	type: {
		type: String,
		required: true,
		validator: (value: string) => ['post', 'page'].includes(value),
	},
});

const runtimeConfig = useRuntimeConfig();
const directusUrl = runtimeConfig.public.directusUrl;

const contentId = computed(() => props.content?.id || null);

const editUrl = computed(() =>
	contentId.value
		? `${directusUrl}/admin/content/${props.type === 'post' ? 'posts' : 'pages'}/${contentId.value}`
		: null,
);

const newUrl = computed(() => `${directusUrl}/admin/content/${props.type === 'post' ? 'posts' : 'pages'}/+`);

const isAuthenticated = ref(false);
const authError = ref(false); // Re-add authError ref
const isDirectusPreview = ref(false);

onMounted(async () => {
	const { $directus } = useNuxtApp();

	try {
		const urlParams = new URLSearchParams(window.location.search);

		if (urlParams.has('directus-preview')) {
			isDirectusPreview.value = true;
			return;
		}

		// Attempt to fetch minimal user data to check authentication
		await $directus.request(readMe({ fields: ['id', 'role'] }));
		isAuthenticated.value = true;
	} catch {
		// If readMe fails, the user is likely not authenticated via the SDK token
		isAuthenticated.value = false;
		authError.value = true; // Set authError to true on failure
	}
});
</script>

<template>
	<div v-if="isAuthenticated && !authError && !isDirectusPreview" class="admin-bar">
		<div class="logo-container">
			<img :src="directusLogo" alt="Directus Logo" class="logo" />
			<span class="draft-mode-text">Draft Mode Enabled</span>
		</div>

		<div class="buttons">
			<a v-if="editUrl" :href="editUrl" target="_blank" class="edit-button">
				{{ type === 'post' ? 'Edit Post' : 'Edit Page' }}
			</a>
			<a :href="newUrl" target="_blank" class="new-button">+ {{ type === 'post' ? 'New Post' : 'New Page' }}</a>
		</div>
	</div>
</template>

<style scoped>
.admin-bar {
	position: fixed;
	top: 55px;
	left: 0;
	width: 100%;
	background: var(--background-variant-color);
	color: white;
	padding: 10px 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	z-index: 9999;
}

.logo-container {
	display: flex;
	align-items: center;
	gap: 10px;
}

.logo {
	height: 24px;
}

.draft-mode-text {
	font-size: 14px;
	color: #ddd;
}

.buttons {
	display: flex;
	gap: 10px;
}

.edit-button {
	background: var(--accent-color);
	color: white;
	padding: 8px 16px;
	border-radius: 4px;
	text-decoration: none;
	font-weight: 500;
}

.new-button {
	background: var(--accent-color-light);
	color: black;
	padding: 8px 16px;
	border-radius: 4px;
	text-decoration: none;
	font-weight: 500;
}

.edit-button:hover,
.new-button:hover {
	opacity: 0.85;
}
</style>
