<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import Circular from '@/components/Circular.vue';
import { delay } from '@/functions/time'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()

const password = ref('');
const c_password = ref('');
const success = ref(false);
const secound = ref(3);

const schema = z
    .object({
        code: z.string({ message: 'Required' }),
        password: z.string().min(8, 'Must be at least 8 characters'),
        c_password: z.string({ message: 'Required' }),
    })
    .refine((data) => data.password === data.c_password, {
        message: 'Passwords do not match',
        path: ['c_password'],
    });


type Schema = z.output<typeof schema>

const state = reactive({
    code: undefined,
    password: undefined,
    c_password: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    console.log(event.data)
    auth.setPageView("");
    auth.setNotiSuccess({
        isOpen: true,
        url: 'https://www.youtube.com/',
        message: 'Password Changed',
        description: 'your password has been changed successfully.',
    });
}
</script>

<template>
    <div class="max-w-[380px] w-full flex flex-col items-center justify-center">
        <NuxtImg src="/logo.png" class="w-40" />
        <div class="flex flex-col items-center justify-center gap-1 mb-8">
            <h1 class="text-3xl font-bold text-slate-700 dark:text-slate-100">Reset Your Password</h1>
            <small class="text-slate-400 dark:text-slate-200 text-sm">
                We have sent a password reset code by email
            </small>
            <small class="text-slate-400 dark:text-slate-200 text-sm">
                to S***@g***. Enter it below to reset your password.
            </small>
        </div>
        <UForm :schema="schema" :state="state" class="space-y-4 w-full" @submit="onSubmit">
            <UFormGroup name="code">
                <UInput v-model="state.code" size="xl" inputClass="p-4" placeholder="Code"/>
            </UFormGroup>
            <UFormGroup name="password" class="relative">
                <UInput placeholder="Password" size="xl" inputClass="p-4" v-model="state.password"
                    :type="auth.hiddenPassword ? 'password' : 'text'" @input="password = $event" />
                <span @click="auth.togglePasswordVisibility"
                    class="cursor-pointer text-gray-500 absolute dark:text-gray-400 z-50 top-[19px] right-4 flex justify-center items-center">
                    <UIcon :name="auth.hiddenPassword
                        ? 'i-heroicons-eye-20-solid'
                        : 'i-heroicons-eye-slash-20-solid'
                        " class="w-5 h-5" />
                </span>
            </UFormGroup>
            <UFormGroup name="c_password" class="relative">
                <UInput placeholder="Confirm Password" size="xl" inputClass="p-4" v-model="state.c_password"
                    :type="auth.hiddenPassword ? 'password' : 'text'" @input="c_password = $event" />
                <span @click="auth.togglePasswordVisibility"
                    class="cursor-pointer text-gray-500 absolute dark:text-gray-400 z-50 top-[19px] right-4 flex justify-center items-center">
                    <UIcon :name="auth.hiddenPassword
                        ? 'i-heroicons-eye-20-solid'
                        : 'i-heroicons-eye-slash-20-solid'
                        " class="w-5 h-5" />
                </span>
            </UFormGroup>
            <div class="pt-4">
                <UButton type="submit" block size="xl" :padded="false" :ui="{
                font: '!text-sm',
                }" class="dark:text-slate-100 py-4">
                    Continue
                </UButton>
            </div>
        </UForm>
        <div class="mt-8 flex flex-col items-center justify-center gap-1 text-sm text-primary-app dark:text-primary-app-400">
            <span class="text-slate-400 dark:text-slate-200 text-sm ">
                Didn’t you receive any code? 
                <button class="text-primary-app dark:text-primary-app-400 font-bold hover:opacity-70 transition-all duration-300 ease-in-out">
                    Resend Code
                </button>
            </span>
            <NuxtLink to="/SigIn" class="font-bold mt-4 flex gap-2 hover:gap-4 transition-all duration-300 ease-in-out">
                <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" /> Back to Sign In
            </NuxtLink>
        </div>
    </div>
</template>