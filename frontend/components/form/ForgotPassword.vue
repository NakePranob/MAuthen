<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore();
const formElement = ref();

const schema = z.object({
    email: z.string({ message: 'Required' }).email('Invalid Email'),
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
        <div class="flex flex-col justify-center gap-1 my-8 w-full">
            <h1 class="text-[32px] font-bold text-primary-app dark:text-primary-app-400">Forgot Password</h1>
            <p class="text-base">
                Enter your Email below and we will send a message to reset your password
            </p>
        </div>
        <UForm :schema="schema" :state="state" class="space-y-8 w-full" @submit="onSubmit">
            <UFormGroup name="email">
                <UInput v-model="state.email" size="xl" inputClass="p-4" placeholder="Email Address" />
            </UFormGroup>
            <UButton type="submit" block size="xl" :padded="false" :ui="{font: '!text-base'}" 
            class="dark:text-slate-100 py-4">
                Continue
            </UButton>
        </UForm>
        <div class="mt-8 flex flex-col items-center justify-center gap-1 text-base">
            <NuxtLink @click="auth.setPageView('')" :to="`/login${auth.uri}`" class="font-bold mt-6 flex gap-2 items-center">
                <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" /> Back to Sign In
            </NuxtLink>
        </div>
    </div>
</template>