<script setup lang="ts">
import { ref } from 'vue';
import { useNuxtApp } from '#app';
import { uploadFiles, createItem } from '@directus/sdk';
import DynamicForm from './DynamicForm.vue';
import type { FormField } from '@@/shared/types/schema';
import { CheckCircle } from 'lucide-vue-next';

interface SubmissionValue {
	field: string;
	value?: string;
	file?: string;
}

interface CustomFormData {
	id: string;
	on_success?: 'redirect' | 'message' | null;
	sort?: number | null;
	submit_label?: string | null;
	success_message?: string | null;
	title?: string | null;
	success_redirect_url?: string | null;
	is_active?: boolean | null;
	fields: FormField[];
}

const props = defineProps<{
	form: CustomFormData;
	className?: string;
}>();

const isSubmitted = ref(false);
const error = ref<string | null>(null);

const handleSubmit = async (data: Record<string, any>) => {
	error.value = null;
	const { $directus } = useNuxtApp();

	try {
		const uploadedFileIds: Record<string, string> = {};
		const submissionValues: SubmissionValue[] = [];

		// 1. Upload files first
		for (const key in data) {
			if (data[key] instanceof File) {
				const file = data[key] as File;
				const fileFormData = new FormData();
				fileFormData.append('file', file);

				try {
					const uploadedFile = await $directus.request(uploadFiles(fileFormData));

					if (uploadedFile?.id) {
						uploadedFileIds[key] = uploadedFile.id;
					} else {
						throw new Error(`Failed to upload file for field: ${key}`);
					}
				} catch (uploadError: any) {
					throw new Error(`Failed to upload file for field: ${key}. Please try again.` + uploadError.message);
				}
			}
		}

		// 2. Prepare submission values payload
		for (const fieldDef of props.form.fields) {
			const fieldName = fieldDef.name;
			const fieldId = fieldDef.id;

			if (!fieldName || !fieldId) continue; // Skip if name or id is missing

			if (uploadedFileIds[fieldName]) {
				// If it was an uploaded file
				submissionValues.push({
					field: fieldId,
					file: uploadedFileIds[fieldName],
				});
			} else if (data[fieldName] !== undefined && data[fieldName] !== null) {
				// If it's a regular value
				submissionValues.push({
					field: fieldId,
					value: data[fieldName]?.toString(),
				});
			}
			// Ignore fields not present in the data (e.g., might be conditional)
		}

		// 3. Create the submission item
		const payload = {
			form: props.form.id,
			values: submissionValues,
		};

		await $directus.request(createItem('form_submissions', payload));

		// 4. Handle success action
		if (props.form.on_success === 'redirect' && props.form.success_redirect_url) {
			window.location.href = props.form.success_redirect_url;
		} else {
			isSubmitted.value = true;
		}
	} catch (submissionError: any) {
		error.value = submissionError?.message || 'Failed to submit the form. Please try again later.';
	}
};
</script>

<template>
	<div v-if="form.is_active" :class="['space-y-6 border border-input p-8 rounded-lg', className]">
		<div v-if="error" class="p-4 text-red-500 bg-red-100 rounded-md">
			<strong>Error:</strong>
			{{ error }}
		</div>
		<div v-if="isSubmitted" class="flex flex-col items-center justify-center space-y-4 p-6 text-center">
			<CheckCircle className="size-12 text-green-500" />
			<p class="text-gray-600">
				{{ form.success_message || 'Your form has been submitted successfully.' }}
			</p>
		</div>
		<DynamicForm v-else :fields="form.fields" :onSubmit="handleSubmit" :submitLabel="form.submit_label || 'Submit'" />
	</div>
</template>
