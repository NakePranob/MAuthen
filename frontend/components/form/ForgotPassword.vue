<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

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
    auth.pageView = 'confirmPassword';
}
</script>

<template>
    <div class="max-w-[380px] w-full flex flex-col items-center justify-center">
        <NuxtImg src="/logo.png" class="w-16" />
        <div class="flex flex-col justify-center gap-1 my-8 w-full">
            <h1 class="text-3xl font-bold text-primary-app dark:text-primary-app-400">Forgot Password</h1>
            <small class="text-sm">
                Enter your Email below and we will send a message to reset your password
            </small>
        </div>
        <UForm :schema="schema" :state="state" class="space-y-8 w-full" @submit="onSubmit">
            <UFormGroup name="email">
                <UInput v-model="state.email" size="xl" inputClass="p-4" placeholder="Email Address" />
            </UFormGroup>
            <UButton type="submit" block size="xl" :padded="false" :ui="{font: '!text-sm'}" 
            class="dark:text-slate-100 py-4">
                Verify
            </UButton>
        </UForm>
        <div class="mt-8 flex flex-col items-center justify-center gap-1 text-sm">
            <button @click="auth.setPageView('signIn')" type="button" class="font-bold mt-4 flex gap-2">
                <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" /> Back to Sign In
            </button>
        </div>
    </div>
</template>