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
        <NuxtImg src="/logo.png" class="w-40" />
        <div class="flex flex-col items-center justify-center gap-1 mb-8">
            <h1 class="text-3xl font-bold text-slate-700 dark:text-slate-100">Forgot Password</h1>
            <small class="text-slate-400 dark:text-slate-200 text-sm">
                Enter your Username below and
            </small>
            <small class="text-slate-400 dark:text-slate-200 text-sm">
                we will send a message to reset your password
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
        <div class="mt-8 flex flex-col items-center justify-center gap-1 text-sm text-primary-app dark:text-primary-app-400">
            <button @click="auth.setPageView('SignIn')" type="button" class="font-bold mt-4 flex gap-2">
                <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" /> Back to Sign In
            </button>
        </div>
    </div>
</template>