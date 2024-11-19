<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types'
import { useAuthStore } from '@/stores/auth'
// import type { User } from '@/types/user'

const auth = useAuthStore()

const hiddenPassword = ref(true);
const password = ref("");

function togglePasswordVisibility() {
    hiddenPassword.value = !hiddenPassword.value;
}

const schema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const state = reactive({
    email: undefined,
    password: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    console.log(event.data);

    try {
        const { data } = await useFetch<{message: string}>('http://localhost:8000/login', {
            method: 'POST',
            body: event.data
        });

        console.log("response:", data.value);

        if (data.value?.message) {
            console.log("message:", data.value.message);

            auth.setOtpEmail(event.data.email);
            auth.setPageView('otp');
        } else {
            console.error('API response does not contain expected fields.');
        }

    } catch (error) {
        console.error('Error submitting form:', error);
    }
}

function goTo(page:string) {
    auth.setPageView(page);
}

</script>

<template>
    <div class="max-w-[380px] w-full flex flex-col items-center justify-center">
        <NuxtImg src="/logo.png" class="w-40" />
        <h1 class="text-3xl font-bold text-slate-700 dark:text-slate-100">M Authen 2.0</h1>
        <small class="text-slate-400 dark:text-slate-200 mt-8 mb-8 text-xs">Welcome to M Authen 2.0, sign in
            with
            your email and password
            as a Single Sign-On (SSO) to access your account & workflows:</small>
        <UForm :schema="schema" :state="state" class="space-y-4 w-full" @submit="onSubmit">
            <UFormGroup name="email">
                <UInput v-model="state.email" size="xl" inputClass="p-4" placeholder="Email" />
            </UFormGroup>
            <UFormGroup name="password" class="relative">
                <UInput placeholder="Password" size="xl" inputClass="p-4" v-model="state.password"
                    :type="auth.hiddenPassword ? 'password' : 'text'" @input="password = $event" />
                <span @click="auth.togglePasswordVisibility"
                    class="cursor-pointer text-gray-500 absolute dark:text-gray-400 z-50 top-[19px] right-4 flex justify-center items-center">
                    <UIcon :name="hiddenPassword
                        ? 'i-heroicons-eye-20-solid'
                        : 'i-heroicons-eye-slash-20-solid'
                        " class="w-5 h-5" />
                </span>
            </UFormGroup>
            <div class="flex justify-end text-sm text-slate-400 dark:text-slate-200 pb-4">
                <span @click="auth.setPageView('forgotPassword')" to="/ForgotPassword" class="cursor-pointer -mt-1">
                    Forgot Password?
                </span>
            </div>
            <UButton type="submit" block size="xl" :padded="false" :ui="{font: '!text-sm'}" 
            class="dark:text-slate-100 py-4">
                Sign In
            </UButton>
        </UForm>
        <p class="text-center text-slate-400 dark:text-slate-200 py-6 text-sm">
            Don’t have an account?
            <button @click="auth.setPageView('signUp')" type="button" class="text-primary-app dark:text-primary-app-400 font-bold">
                Sign Up
            </button>
        </p>
        <small class="text-center text-slate-400 dark:text-slate-200 text-xs">
            Thank you for using our service. If you have any questions or need further assistance, please do not
            hesitate
            to contact us.
        </small>
    </div>
</template>