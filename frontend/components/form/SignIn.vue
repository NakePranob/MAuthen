<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { useAuthStore } from '@/stores/auth';
// import type { User } from '@/types/user'

const toast = useToast();
const auth = useAuthStore();
const client_id = ref('');
const redirectUri = ref('');
const formElement = ref();
const xsrfToken = useCookie('XSRF-TOKEN');

onMounted(() => {
    redirectUri.value = new URLSearchParams(window.location.search).get('redirect_uri') || '';
    client_id.value = new URLSearchParams(window.location.search).get('client_id') || '';
    getElementHeight();
    console.log('userCookie', xsrfToken.value);
});

const getElementHeight = () => {
    const element = formElement.value
    const height = element.clientHeight // หรือใช้ offsetHeight ขึ้นอยู่กับความต้องการ

    auth.setFormElementHight(height);
}

const schema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const state = reactive({
    email: undefined,
    password: undefined
});

async function onSubmit(event: FormSubmitEvent<Schema>) {

    const form = document.createElement('form');
    form.method = 'POST'; // ส่งข้อมูลแบบ POST
    form.action = `http://localhost:3002/api/v1/auth/login${auth.uri}`; // URL ของ Backend
    form.style.display = 'none'; // ซ่อนฟอร์มเพื่อไม่ให้ผู้ใช้เห็น

    // เพิ่มข้อมูล email
    const emailInput = document.createElement('input');
    emailInput.type = 'hidden';
    emailInput.name = 'username';
    emailInput.value = event.data.email;
    form.appendChild(emailInput);

    // เพิ่มข้อมูล password
    const passwordInput = document.createElement('input');
    passwordInput.type = 'hidden';
    passwordInput.name = 'password';
    passwordInput.value = event.data.password;
    form.appendChild(passwordInput);

    // เพิ่มข้อมูล _csrf
    const _csrfInput = document.createElement('input');
    _csrfInput.type = 'hidden';
    _csrfInput.name = '_csrf';
    _csrfInput.value = xsrfToken.value || '';
    form.appendChild(_csrfInput);


    try {
        document.body.appendChild(form);
        form.submit();

        // console.log(event.data);
        // auth.setOtpEmail(event.data.email);
        // auth.setPageView('otp');
    } catch (error) {
        // console.error('Error submitting form:', error);
        toast.add({ title: 'Incorrect email or password.' })
    }
}


</script>

<template>
    <div ref="formElement" class="max-w-[420px] w-full flex flex-col items-center justify-center gap-y-4">
        <NuxtImg src="/logo.png" class="w-[60px]" />
        <div class="flex flex-col justify-center gap-1 mt-8 w-full">
            <h1 class="text-[32px] font-bold text-primary-app dark:text-primary-app-400">Sign In</h1>
            <p class="text-base">
                Welcome to M - Authentication, sign in with your email
                and password as a Single Sign-On (SSO) to access your
                account & workflows:
            </p>
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
            <div class="text-base pb-4">
                <NuxtLink @click="auth.setPageView('')" :to="`/forgotpassword${auth.uri}`" class="cursor-pointer -mt-1">
                    Forgot Password?
                </NuxtLink @click="auth.setPageView('')">
            </div>
            <UButton type="submit" block size="xl" :padded="false" :ui="{ font: '!text-base' }"
                class="dark:text-slate-100 py-4">
                Sign In
            </UButton>
        </UForm>
        <p class="text-center text-base">
            Don’t have an account?
            <NuxtLink @click="auth.setPageView('')" :to="`/register${auth.uri}`"
                class="text-primary-app dark:text-primary-app-400 font-bold">
                Sign Up
            </NuxtLink @click="auth.setPageView('')">
        </p>
        <p class="mt-4">
            Thank you for using our service. If you have any questions or need further assistance, please do not
            hesitate to contact us.
        </p>
    </div>
</template>