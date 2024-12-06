<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore();
const formElement = ref();
const client_id = ref('');

onMounted(() => {
    getElementHeight();
    client_id.value = new URLSearchParams(window.location.search).get('client_id') || '';
});

const getElementHeight = () => {
    if (formElement.value) {
        const height = formElement.value.offsetHeight;
        console.log('Height of the element:', height);
        auth.setFormElementHight(height);
    }
};

const validatePassword = ref<{
    path: string,
    message?: string,
}[]>([]);

const validate = (state: any): FormError[] => {
    const errors = []
    const errorsPassword = []
    if (!state.email) errors.push({ path: 'email', message: 'Required' })
    if (!state.email.includes('@')) errors.push({ path: 'email', message: 'Invalid email' })
    if (!/[a-z]/.test(state.password) && auth.passwordPolicy.RequireLowercase) errorsPassword.push({ path: 'password', message: 'Password must contain a lower case letter' })
    if (!/[A-Z]/.test(state.password) && auth.passwordPolicy.RequireUppercase) errorsPassword.push({ path: 'password', message: 'Password must contain an upper case letter' })
    if (!/\d/.test(state.password) && auth.passwordPolicy.RequireNumbers) errorsPassword.push({ path: 'password', message: 'Password must contain a number' })
    if (!state.password || state.password.length < auth.passwordPolicy.MinimumLength) errorsPassword.push({ path: 'password', message: `Password must contain at least ${auth.passwordPolicy.MinimumLength} characters` })
    if (!/[!@#$%^&*(),.?":{}|<>_]/.test(state.password) && auth.passwordPolicy.RequireSymbols) errorsPassword.push({ path: 'password', message: 'Password must contain a special character or a space' })
    if (/ /.test(state.password)) errorsPassword.push({ path: 'password', message: 'Password must not contain a leading or trailing space' })


    validatePassword.value = errorsPassword;
    return errors
}

const state = reactive({
    email: undefined,
    password: undefined,
})

async function onSubmit(event: FormSubmitEvent<any>) {
    if (validatePassword.value.some(error => error.path === 'password')) {
        return;
    }
    // Do something with event.data
    console.log(event.data);
    const formData = {
        username: event.data.email,
        password: event.data.password,
        client_id: client_id.value
    }
    try {
        const { data } = await useFetch<any>("http://localhost:3002/api/v1/auth/register", {
            method: "POST",
            body: formData,
        });
        auth.setEmailForCodeVerification(event.data.email);
        auth.setPageView('codeVerification');
    } catch (error) {
        console.error("Error submitting form:", error);
    }
}

</script>

<template>
    <div v-if="!client_id">
        Required String parameter 'client_id' is not present
    </div>
    <div v-else class="max-w-[420px] w-full flex flex-col items-center justify-center gap-y-4">
        <NuxtImg src="/logo.png" class="w-[60px]" />
        <div class="flex flex-col justify-center gap-1 mt-8 w-full">
            <h1 class="text-[32px] font-bold text-primary-app dark:text-primary-app-400">Sign Up</h1>
            <p class="text-base">
                Sign up with a new account
            </p>
        </div>
        <UForm :validate="validate" :state="state" class="space-y-4 w-full mt-6" @submit="onSubmit">
            <UFormGroup name="email">
                <UInput v-model="state.email" size="xl" inputClass="p-4" placeholder="Email" />
            </UFormGroup>
            <UFormGroup class="relative">
                <UInput placeholder="Password" size="xl" inputClass="p-4" v-model="state.password"
                    :type="auth.hiddenPassword ? 'password' : 'text'"
                    :color="validatePassword.some(error => error.path === 'password') ? 'red' : undefined" />
                <p @click="auth.togglePasswordVisibility"
                    class="cursor-pointer text-gray-500 absolute dark:text-gray-400 z-50 top-[19px] right-4 flex justify-center items-center">
                    <UIcon :name="auth.hiddenPassword
                        ? 'i-heroicons-eye-20-solid'
                        : 'i-heroicons-eye-slash-20-solid'
                        " class="w-5 h-5" />
                </p>
            </UFormGroup>
            <div class="text-xs flex flex-col justify-center transition-all duration-300 ease-in-out"
                :class="state.password ? `h-[${auth.passwordPolicyHeight}px]` : 'h-0 opacity-0 overflow-hidden'">
                <div v-if="auth.passwordPolicy.RequireLowercase" class="flex items-center gap-1">
                    <p
                        :class="validatePassword.some(error => error.message === 'Password must contain a lower case letter') ? 'text-red-500' : 'text-green-500'">
                        <UIcon :name="validatePassword.some(error => error.message === 'Password must contain a lower case letter')
                            ? 'i-heroicons-x-mark-20-solid'
                            : 'i-heroicons-check-20-solid'
                            " class="w-4 text-sm" />
                    </p>
                    Password must contain a lower case letter
                </div>
                <div v-if="auth.passwordPolicy.RequireUppercase" class="flex items-center gap-1">
                    <p
                        :class="validatePassword.some(error => error.message === 'Password must contain an upper case letter') ? 'text-red-500' : 'text-green-500'">
                        <UIcon :name="validatePassword.some(error => error.message === 'Password must contain an upper case letter')
                            ? 'i-heroicons-x-mark-20-solid'
                            : 'i-heroicons-check-20-solid'
                            " class="w-4 text-sm" />
                    </p>
                    Password must contain an upper case letter
                </div>
                <div v-if="auth.passwordPolicy.RequireNumbers" class="flex items-center gap-1">
                    <p
                        :class="validatePassword.some(error => error.message === 'Password must contain a number') ? 'text-red-500' : 'text-green-500'">
                        <UIcon :name="validatePassword.some(error => error.message === 'Password must contain a number')
                            ? 'i-heroicons-x-mark-20-solid'
                            : 'i-heroicons-check-20-solid'
                            " class="w-4 text-sm" />
                    </p>
                    Password must contain a number
                </div>
                <div class="flex items-center gap-1">
                    <p
                        :class="validatePassword.some(error => error.message === `Password must contain at least ${auth.passwordPolicy.MinimumLength} characters`) ? 'text-red-500' : 'text-green-500'">
                        <UIcon :name="validatePassword.some(error => error.message === `Password must contain at least ${auth.passwordPolicy.MinimumLength} characters`)
                            ? 'i-heroicons-x-mark-20-solid'
                            : 'i-heroicons-check-20-solid'
                            " class="w-4 text-sm" />
                    </p>
                    Password must contain at least {{ auth.passwordPolicy.MinimumLength }} characters
                </div>
                <div v-if="auth.passwordPolicy.RequireSymbols" class="flex items-center gap-1">
                    <p
                        :class="validatePassword.some(error => error.message === 'Password must contain a special character or a space') ? 'text-red-500' : 'text-green-500'">
                        <UIcon :name="validatePassword.some(error => error.message === 'Password must contain a special character or a space')
                            ? 'i-heroicons-x-mark-20-solid'
                            : 'i-heroicons-check-20-solid'
                            " class="w-4 text-sm" />
                    </p>
                    Password must contain a special character or a space
                </div>
                <div class="flex items-center gap-1">
                    <p
                        :class="validatePassword.some(error => error.message === 'Password must not contain a leading or trailing space') ? 'text-red-500' : 'text-green-500'">
                        <UIcon :name="validatePassword.some(error => error.message === 'Password must contain an upper case letter')
                            ? 'i-heroicons-x-mark-20-solid'
                            : 'i-heroicons-check-20-solid'
                            " class="w-4 text-sm" />
                    </p>
                    Password must not contain a leading or trailing space
                </div>
            </div>
            <UButton type="submit" block size="xl" :padded="false" :ui="{ font: '!text-base' }"
                class="dark:text-slate-100 py-4">
                Sign Up
            </UButton>
        </UForm>
        <div class="mt-8 w-full flex justify-center">
            <p class="text-base">
                Already have an account? 
                <NuxtLink @click="auth.setPageView('')" :to="`/login${auth.uri}`"
                    class="text-primary-app dark:text-primary-app-400 font-bold">
                    Sign In
                </NuxtLink>
            </p>
        </div>
    </div>
</template>