<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps({
	error: Object as () => NuxtError,
});
</script>

<template>
	<div>
		<!-- <NuxtLayout name="default"> -->
		<h1 class="mt-20 text-5xl font-bold text-center mx-auto">{{ error.statusCode }}</h1>
		<Headline content="Oh No! 4-0-Fo!" size="xl" color="secondary" />
		<Text
			as="p"
			size="lg"
			class="mx-auto max-w-md mt-4 text-red-900"
			content="Oops! The page you are looking for does not exist."
		></Text>
		<!-- </NuxtLayout> -->
	</div>
</template>
