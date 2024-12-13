<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore();
const formElement = ref();

const schema = z.object({
    email: z
        .string({ message: 'email-policy-required' })
        .email('email-policy-invalid')
        .refine((value) => !value.includes("themall.co.th") && !value.includes("emporium.co.th"),
            {
                message: "email-policy-is-themall-or-emporiumthailand",
            }
        )
})

type Schema = z.output<typeof schema>

const state = reactive({
    email: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    // Do something with event.data
    console.log(event.data)
    auth.setEmailForgotPassword(event.data.email);
    auth.pageView = 'confirmPassword';
}

const getElementHeight = () => {
    if (formElement.value) {
        const height = formElement.value.offsetHeight;
        console.log('Height of the element:', height);
        auth.setFormElementHight(height);
    }
};

onMounted(() => {
    getElementHeight();
});
</script>

<template>
    <div class="max-w-[420px] w-full flex flex-col items-center justify-center">
        <NuxtImg src="/logo.png" class="w-[60px]" />
        <div class="flex flex-col justify-center gap-2 mt-10 mb-8 w-full">
            <h1 class="text-[32px] font-bold text-primary-app dark:text-primary-app-400">{{ $t('forgot-password-title') }}</h1>
            <p class="text-base">
                {{ $t('forgot-password-description') }}
            </p>
        </div>
        <UForm :schema="schema" :state="state" class="space-y-8 w-full" @submit="onSubmit">
            <TFormGroup name="email">
                <UInput v-model="state.email" size="xl" inputClass="p-4" :placeholder="$t('email-address')" />
            </TFormGroup>
            <UButton type="submit" block size="xl" :padded="false" :ui="{ font: '!text-base' }"
                class="dark:text-slate-100 py-4">
                {{ $t('continue-button') }}
            </UButton>
        </UForm>
        <div class="mt-10 flex flex-col items-center justify-center gap-1 text-base">
            <NuxtLink @click="auth.setPageView('')" :to="`/login${auth.uri}`"
                class="font-bold flex gap-2 items-center">
                <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" /> {{ $t('back-to-sign-in') }}
            </NuxtLink>
        </div>
    </div>
</template>