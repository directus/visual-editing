<script setup lang="ts">
import { computed } from 'vue';
import { defineAsyncComponent } from 'vue';

// import using `defineAsyncComponent` to load components only when needed
const Hero = defineAsyncComponent(() => import('~/components/block/Hero.vue'));
const RichText = defineAsyncComponent(() => import('~/components/block/RichText.vue'));
const Gallery = defineAsyncComponent(() => import('~/components/block/Gallery.vue'));
const Pricing = defineAsyncComponent(() => import('~/components/block/Pricing.vue'));
const Posts = defineAsyncComponent(() => import('~/components/block/Posts.vue'));
const Form = defineAsyncComponent(() => import('~/components/block/FormBlock.vue'));

interface BaseBlockProps {
	block: {
		collection: string;
		item: any;
		id: string;
	};
}

const props = defineProps<BaseBlockProps>();

const components: Record<string, any> = {
	block_hero: Hero,
	block_richtext: RichText,
	block_gallery: Gallery,
	block_pricing: Pricing,
	block_posts: Posts,
	block_form: Form,
};

const Component = computed(() => components[props.block.collection] || null);
const blockData = computed(() => props.block.item);
</script>
<template>
	<component :is="Component" v-if="Component" :id="`block-${block.id}`" :data="blockData" />
</template>
