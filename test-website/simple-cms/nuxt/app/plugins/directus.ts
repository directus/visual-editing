import { createDirectus, rest, staticToken } from '@directus/sdk';

export default defineNuxtPlugin(() => {
	const token = useRuntimeConfig().public.dontDoThisInProductionToken || useRuntimeConfig().directusServerToken;

	const directus = createDirectus(`${useRuntimeConfig().public.directusUrl}`, {
		globals: {
			fetch: $fetch,
		},
	})
		.with(rest())
		.with(staticToken(token));

	return {
		provide: {
			directus,
		},
	};
});
