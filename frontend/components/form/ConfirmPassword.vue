<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore();
const formElement = ref();

const validatePassword = ref<{
    path: string,
    message?: string,
}[]>([]);

const validate = (state: any): FormError[] => {
    const errors = []
    const errorsPassword = []
    if (!state.code) errors.push({ path: 'code', message: 'Required' })
    if (!/[a-z]/.test(state.password) && auth.passwordPolicy.RequireLowercase) errorsPassword.push({ path: 'password', message: 'Password must contain a lower case letter'})
    if (!/[A-Z]/.test(state.password) && auth.passwordPolicy.RequireUppercase) errorsPassword.push({ path: 'password', message: 'Password must contain an upper case letter'})
    if (!/\d/.test(state.password) && auth.passwordPolicy.RequireNumbers) errorsPassword.push({ path: 'password', message: 'Password must contain a number'})
    if (!state.password || state.password.length < auth.passwordPolicy.MinimumLength) errorsPassword.push({ path: 'password', message: `Password must contain at least ${auth.passwordPolicy.MinimumLength} characters` })
    if (!/[!@#$%^&*(),.?":{}|<>_]/.test(state.password) && auth.passwordPolicy.RequireSymbols) errorsPassword.push({ path: 'password', message: 'Password must contain a special character or a space'})
    if (/ /.test(state.password)) errorsPassword.push({ path: 'password', message: 'Password must not contain a leading or trailing space'})
    if (state.password != state.c_password) errors.push({ path: 'c_password', message: 'Password not match'})
    
    validatePassword.value = errorsPassword;
    return errors
}

const state = reactive({
    code: undefined,
    password: undefined,
    c_password: undefined,
})

async function onSubmit(event: FormSubmitEvent<any>) {
    if (validatePassword.value.some(error => error.path === 'password')) {
        return;
    }

    console.log(event.data)
    auth.setPageView("");
    auth.setNotiSuccess({
        isOpen: true,
        url: 'https://www.youtube.com/',
        message: 'Password Changed',
        description: 'your password has been changed successfully.',
    });
}

const email = ref('');
onMounted(() => {
    email.value = obfuscateEmail(auth.emailForgotPassword);
    getElementHeight();
});

const getElementHeight = () => {
    if (formElement.value) {
        const height = formElement.value.offsetHeight;
        console.log('Height of the element:', height);
        auth.setFormElementHight(height);
    }
};

function obfuscateEmail(email: string) {
    const [localPart, domainPart] = email.split("@");
    const maskedLocal = localPart[0] + "***";
    const maskedDomain = domainPart[0] + "***.";
    return `${maskedLocal}@${maskedDomain}`;
}
</script>

<template>
    <div class="max-w-[420px] w-full flex flex-col items-center justify-center">
        <NuxtImg src="/logo.png" class="w-[60px]" />
        <div class="flex flex-col justify-center gap-1 my-8 w-full">
            <h1 class="text-[32px] font-bold text-primary-app dark:text-primary-app-400">Reset Your Password</h1>
            <p class="text-base">
                We have sent a password reset code by email
            </p>
            <p class="text-base">
                to {{ email }} Enter it below to reset your password.
            </p>
        </div>
        <UForm :validate="validate" :state="state" class="space-y-4 w-full" @submit="onSubmit">
            <UFormGroup name="code">
                <UInput v-model="state.code" size="xl" inputClass="p-4" placeholder="Code" />
            </UFormGroup>
            <UFormGroup name="password" class="relative">
                <UInput placeholder="Password" size="xl" inputClass="p-4" v-model="state.password"
                    :type="auth.hiddenPassword ? 'password' : 'text'" 
                    :color="validatePassword.some(error => error.path === 'password') ? 'red' : undefined"/>
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
                    :type="auth.hiddenPassword ? 'password' : 'text'" 
                    :color="validatePassword.some(error => error.path === 'c_password') ? 'red' : undefined"/>
                <span @click="auth.togglePasswordVisibility"
                    class="cursor-pointer text-gray-500 absolute dark:text-gray-400 z-50 top-[19px] right-4 flex justify-center items-center">
                    <UIcon :name="auth.hiddenPassword
                        ? 'i-heroicons-eye-20-solid'
                        : 'i-heroicons-eye-slash-20-solid'
                        " class="w-5 h-5" />
                </span>
            </UFormGroup>
            <div class="text-xs flex flex-col justify-center transition-all duration-300 ease-in-out"
            :class="state.password ? `h-[${auth.passwordPolicyHeight}px]` : 'h-0 opacity-0 overflow-hidden'">
                <div v-if="auth.passwordPolicy.RequireLowercase" class="flex items-center gap-1">
                    <p :class="validatePassword.some(error => error.message === 'Password must contain a lower case letter') ? 'text-red-500' : 'text-green-500'">
                        <UIcon :name="validatePassword.some(error => error.message === 'Password must contain a lower case letter')
                        ? 'i-heroicons-x-mark-20-solid'
                        : 'i-heroicons-check-20-solid'
                        " class="w-4 text-sm" />
                    </p> 
                    Password must contain a lower case letter
                </div>
                <div v-if="auth.passwordPolicy.RequireUppercase" class="flex items-center gap-1">
                    <p :class="validatePassword.some(error => error.message === 'Password must contain an upper case letter') ? 'text-red-500' : 'text-green-500'">
                        <UIcon :name="validatePassword.some(error => error.message === 'Password must contain an upper case letter')
                        ? 'i-heroicons-x-mark-20-solid'
                        : 'i-heroicons-check-20-solid'
                        " class="w-4 text-sm" />
                    </p> 
                    Password must contain an upper case letter
                </div>
                <div v-if="auth.passwordPolicy.RequireNumbers" class="flex items-center gap-1">
                    <p :class="validatePassword.some(error => error.message === 'Password must contain a number') ? 'text-red-500' : 'text-green-500'">
                        <UIcon :name="validatePassword.some(error => error.message === 'Password must contain a number')
                        ? 'i-heroicons-x-mark-20-solid'
                        : 'i-heroicons-check-20-solid'
                        " class="w-4 text-sm" />
                    </p> 
                    Password must contain a number
                </div>
                <div class="flex items-center gap-1">
                    <p :class="validatePassword.some(error => error.message === `Password must contain at least ${auth.passwordPolicy.MinimumLength} characters`) ? 'text-red-500' : 'text-green-500'">
                        <UIcon :name="validatePassword.some(error => error.message === `Password must contain at least ${auth.passwordPolicy.MinimumLength} characters`)
                        ? 'i-heroicons-x-mark-20-solid'
                        : 'i-heroicons-check-20-solid'
                        " class="w-4 text-sm" />
                    </p> 
                    Password must contain at least {{auth.passwordPolicy.MinimumLength}} characters
                </div>
                <div v-if="auth.passwordPolicy.RequireSymbols"class="flex items-center gap-1">
                    <p :class="validatePassword.some(error => error.message === 'Password must contain a special character or a space') ? 'text-red-500' : 'text-green-500'">
                        <UIcon :name="validatePassword.some(error => error.message === 'Password must contain a special character or a space')
                        ? 'i-heroicons-x-mark-20-solid'
                        : 'i-heroicons-check-20-solid'
                        " class="w-4 text-sm" />
                    </p> 
                    Password must contain a special character or a space
                </div>
                <div class="flex items-center gap-1">
                    <p :class="validatePassword.some(error => error.message === 'Password must not contain a leading or trailing space') ? 'text-red-500' : 'text-green-500'">
                        <UIcon :name="validatePassword.some(error => error.message === 'Password must contain an upper case letter')
                        ? 'i-heroicons-x-mark-20-solid'
                        : 'i-heroicons-check-20-solid'
                        " class="w-4 text-sm" />
                    </p> 
                    Password must not contain a leading or trailing space
                </div>
            </div>
            <div>
                <UButton type="submit" block size="xl" :padded="false" :ui="{
                    font: '!text-base',
                }" class="dark:text-slate-100 py-4">
                    Continue
                </UButton>
            </div>
        </UForm>
        <div class="mt-8 flex flex-col items-center justify-center gap-1 text-base">
            <span class="text-base ">
                Didn’t you receive any code? 
                <button
                    class="text-primary-app dark:text-primary-app-400 font-bold hover:opacity-70 transition-all duration-300 ease-in-out">
                    Resend Code
                </button>
            </span>
            <NuxtLink @click="auth.setPageView('')" :to="`/login${auth.uri}`"
                class="font-bold mt-6 flex gap-2 hover:gap-4 transition-all duration-300 ease-in-out">
                <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" /> Back to Sign In
            </NuxtLink>
        </div>
    </div>
</template>