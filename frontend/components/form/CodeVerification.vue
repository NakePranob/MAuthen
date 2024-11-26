<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

const schema = z.object({
    code: z.string({ message: 'Required' }),
})

type Schema = z.output<typeof schema>

const state = reactive({
    code: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    console.log(event.data)
    auth.setPageView("");
    auth.setNotiSuccess({
        isOpen: true,
        url: 'https://www.youtube.com/',
        message: 'Sign Up Successfully',
        description: 'Your email was confirmed and you are now logged in.',
    });
}
</script>

<template>
    <div class="max-w-[380px] w-full flex flex-col items-center justify-center">
        <NuxtImg src="/logo.png" class="w-20" />
        <div class="flex flex-col justify-center gap-1 mt-8 w-full">
            <h1 class="text-3xl font-bold text-primary-app dark:text-primary-app-400">Code Verification</h1>
            <small class="text-sm">
                Code Verification has been sent via email to
            </small>
            <b class="text-primary-app dark:text-primary-app-400 font-bold text-sm mb-2">{{ auth.otpEmail }}</b>
        </div>
        <UForm :schema="schema" :state="state" class="space-y-8 w-full" @submit="onSubmit">
            <UFormGroup name="code" label="Enter the Code below to verify it.">
                <UInput v-model="state.code" size="xl" inputClass="text-center py-4 text-sm mt-1" placeholder="Code"/>
            </UFormGroup>
            <UButton type="submit" block size="xl" :padded="false" :ui="{font: '!text-sm'}" 
            class="dark:text-slate-100 py-4">
                Verify
            </UButton>
        </UForm>
        <div
            class="mt-8 flex flex-col items-center justify-center gap-1 text-sm">
            <div class="flex-1 flex flex-col items-center justify-center">
                <span>Didn’t you receive any Code? </span>
                <b class="text-primary-app dark:text-primary-app-400 font-bold">Resend Code in 00 : 17</b>
            </div>
            <button @click="auth.setPageView('signIn')" type="button" class="font-bold mt-4 flex gap-2">
                <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" /> Back to Sign In
            </button>
        </div>
    </div>
</template>
