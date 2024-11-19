<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types'
import { useAuthStore } from '@/stores/auth'
// import type { User } from '@/types/user'

const auth = useAuthStore()

const schema = z
    .object({
        email: z.string().email('Invalid email'),
        password: z.string().min(8, 'Must be at least 8 characters'),
        c_password: z.string({ message: 'Required' })
    })
    .refine((data) => data.password === data.c_password, {
        message: 'Passwords do not match',
        path: ['c_password']
    });

type Schema = z.output<typeof schema>

const state = reactive({
    email: undefined,
    password: undefined,
    c_password: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    // Do something with event.data
    console.log(event.data);
    auth.setEmailForCodeVerification(event.data.email);
    auth.setPageView('codeVerification');
}

</script>

<template>
    <div class="max-w-[380px] w-full flex flex-col items-center justify-center">
        <NuxtImg src="/logo.png" class="w-40" />
        <h1 class="text-3xl font-bold text-slate-700 dark:text-slate-100">Sign Up</h1>
        <small class="text-slate-400 dark:text-slate-200 mb-8 text-sm">
            Sign up with a new account
        </small>
        <UForm :schema="schema" :state="state" class="space-y-4 w-full" @submit="onSubmit">
            <UFormGroup name="email">
                <UInput v-model="state.email" size="xl" inputClass="p-4" placeholder="Email" />
            </UFormGroup>
            <UFormGroup name="password" class="relative">
                <UInput placeholder="Password" size="xl" inputClass="p-4" v-model="state.password"
                    :type="auth.hiddenPassword ? 'password' : 'text'"/>
                <span @click="auth.togglePasswordVisibility"
                    class="cursor-pointer text-gray-500 absolute dark:text-gray-400 z-50 top-[19px] right-4 flex justify-center items-center">
                    <UIcon :name="auth.hiddenPassword
                        ? 'i-heroicons-eye-20-solid'
                        : 'i-heroicons-eye-slash-20-solid'
                        " class="w-5 h-5" />
                </span>
            </UFormGroup>
            <UFormGroup name="c_password" class="relative">
                <UInput placeholder="Password" size="xl" inputClass="p-4" v-model="state.c_password"
                    :type="auth.hiddenPassword ? 'password' : 'text'"/>
                <span @click="auth.togglePasswordVisibility"
                    class="cursor-pointer text-gray-500 absolute dark:text-gray-400 z-50 top-[19px] right-4 flex justify-center items-center">
                    <UIcon :name="auth.hiddenPassword
                        ? 'i-heroicons-eye-20-solid'
                        : 'i-heroicons-eye-slash-20-solid'
                        " class="w-5 h-5" />
                </span>
            </UFormGroup>
            <UButton type="submit" block size="xl" :padded="false" :ui="{font: '!text-sm'}" 
            class="dark:text-slate-100 py-4">
                Sign Up
            </UButton>
        </UForm>
        <div class="mt-8 w-full flex justify-center">
            <span class="text-slate-400 dark:text-slate-200 text-sm ">
                Already have an account? 
                <button @click="auth.setPageView('signIn')" type="button" class="text-primary-app dark:text-primary-app-400 font-bold">
                    Sign In
                </button>
            </span>
        </div>
    </div>
</template>