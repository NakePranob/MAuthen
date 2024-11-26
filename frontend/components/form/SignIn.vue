<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types'
import { useAuthStore } from '@/stores/auth'
// import type { User } from '@/types/user'

const auth = useAuthStore()
const protocol = ref('');
const response_type = ref('');
const client_id = ref('');
const redirectUri = ref('');
const scope = ref('');
const states = ref('');
const code_challenge_method = ref('S256');
const nonce = ref('');
const code_challenge = ref('');

onMounted(() => {
    redirectUri.value = new URLSearchParams(window.location.search).get('redirect_uri') || '';
    states.value = new URLSearchParams(window.location.search).get('state') || '';
    client_id.value = new URLSearchParams(window.location.search).get('client_id') || '';
});


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

    const formData = {
        email: event.data.email,
        password: event.data.password,
        client_id: client_id.value,
        redirectUri: redirectUri.value
    }
    try {
        const { data } = await useFetch<{
            id_token: string,
            expires_in: number,
            token_type: string,
            state: string,
            redirectUri: string
        }>('http://localhost:8000/signin', {
            method: 'POST',
            body: formData
        });

        console.log("response:", data.value);
        window.location.href = `${data.value?.redirectUri}#id_token=${data.value?.id_token}&expires_in=${data.value?.expires_in}&token_type=${data.value?.token_type}&state=${data.value?.state}`;

    } catch (error) {
        console.error('Error submitting form:', error);
    }
}
</script>

<template>
    <div class="max-w-[420px] w-full flex flex-col items-center justify-center gap-y-4">
        <NuxtImg src="/logo.png" class="w-16" />
        <div class="flex flex-col justify-center gap-1 mt-8 w-full">
            <h1 class="text-3xl font-bold text-primary-app dark:text-primary-app-400">Sign In</h1>
            <small class="text-sm">
                Welcome to M - Authentication, sign in with your email
                and password as a Single Sign-On (SSO) to access your
                account & workflows:
            </small>
        </div>
        <UForm :schema="schema" :state="state" class="space-y-4 w-full mt-4" @submit="onSubmit">
            <UFormGroup name="email">
                <UInput v-model="state.email" size="xl" inputClass="p-4" placeholder="Email" />
            </UFormGroup>
            <UFormGroup name="password" class="relative">
                <UInput placeholder="Password" size="xl" inputClass="p-4" v-model="state.password"
                    :type="auth.hiddenPassword ? 'password' : 'text'" />
                <span @click="auth.togglePasswordVisibility"
                    class="cursor-pointer text-gray-500 absolute dark:text-gray-400 z-50 top-[19px] right-4 flex justify-center items-center">
                    <UIcon :name="auth.hiddenPassword
                        ? 'i-heroicons-eye-20-solid'
                        : 'i-heroicons-eye-slash-20-solid'
                        " class="w-5 h-5" />
                </span>
            </UFormGroup>
            <div class="text-sm pb-4">
                <span @click="auth.setPageView('forgotPassword')" to="/ForgotPassword" class="cursor-pointer -mt-1">
                    Forgot Password?
                </span>
            </div>
            <UButton type="submit" block size="xl" :padded="false" :ui="{ font: '!text-sm' }"
                class="dark:text-slate-100 py-4">
                Sign In
            </UButton>
        </UForm>
        <p class="text-center text-sm">
            Don’t have an account?
            <button @click="auth.setPageView('signUp')" type="button"
                class="text-primary-app dark:text-primary-app-400 font-bold">
                Sign Up
            </button>
        </p>
        <small class="mt-4">
            Thank you for using our service. If you have any questions or need further assistance, please do not hesitate to contact us.
        </small>
    </div>
</template>