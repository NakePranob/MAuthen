<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const validate = (state: any): FormError[] => {
    const errors = []
    if (!state.email) errors.push({ path: 'email', message: 'Required' })
    if (!state.email.includes('@')) errors.push({ path: 'email', message: 'Invalid email' })
    if (!state.password) errors.push({ path: 'password', message: 'Required' })
    if (state.password.length < 8) errors.push({ path: 'password', message: 'Must be at least 8 characters' })
    console.log(errors);
    return errors
}

const state = reactive({
    email: undefined,
    password: undefined,
})

async function onSubmit(event: FormSubmitEvent<any>) {
    // Do something with event.data
    console.log(event.data);
    // auth.setEmailForCodeVerification(event.data.email);
    // auth.setPageView('codeVerification');
}

</script>

<template>
    <div class="max-w-[380px] w-full flex flex-col items-center justify-center">
        <NuxtImg src="/logo.png" class="w-16" />
        <div class="flex flex-col justify-center gap-1 mt-8 w-full">
            <h1 class="text-3xl font-bold text-primary-app dark:text-primary-app-400">Sign Up</h1>
            <small class="text-sm">
                Sign up with a new account
            </small>
        </div>
        <UForm :validate="validate" :state="state" class="space-y-4 w-full mt-6" @submit="onSubmit">
            <UFormGroup name="email">
                <UInput v-model="state.email" size="xl" inputClass="p-4" placeholder="Email" />
            </UFormGroup>
            <UFormGroup class="relative">
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
            <div class="text-sm">
                <p>✓ Password must contain a lower case letter</p>
                <p>✓ Password must contain an upper case letter</p>
                <p>✓ Password must contain a number</p>
                <p>✓ Password must contain at least 8 characters</p>
                <p>✓ Password must contain a special character or a space</p>
                <p>✓ Password must not contain a leading or trailing space</p>
            </div>
            <UButton type="submit" block size="xl" :padded="false" :ui="{font: '!text-sm'}" 
            class="dark:text-slate-100 py-4">
                Sign Up
            </UButton>
        </UForm>
        <div class="mt-8 w-full flex justify-center">
            <span class="text-sm">
                Already have an account? 
                <button @click="auth.setPageView('signIn')" type="button" class="text-primary-app dark:text-primary-app-400 font-bold">
                    Sign In
                </button>
            </span>
        </div>
    </div>
</template>