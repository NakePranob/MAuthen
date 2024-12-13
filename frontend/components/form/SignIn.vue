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
const xsrfToken = useCookie('XSRFTOKEN');
const errorMsg = useCookie('cognito-fl');

const decodedBase64 = (token: string) => {
    // ตรวจสอบและเพิ่ม padding หากจำเป็น
    const paddedEncodedToken = token.padEnd(token.length + (4 - (token.length % 4)) % 4, '=');

    // ถอดรหัส Base64
    const decodedToken = atob(paddedEncodedToken);

    // แปลงข้อมูลจาก String เป็น JSON
    const decodedJson = JSON.parse(decodedToken);
    console.log(decodedJson);

    return decodedJson;
};

onMounted(() => {
    redirectUri.value = new URLSearchParams(window.location.search).get('redirect_uri') || '';
    client_id.value = new URLSearchParams(window.location.search).get('client_id') || '';
    getElementHeight();
    if (errorMsg.value && errorMsg.value !== 'W10=') {
        const err = decodedBase64(errorMsg.value);
        toast.add({ title: err.map.loginErrorMessage });
        errorMsg.value = btoa('[]');
        console.log(err);
    }
});

const getElementHeight = () => {
    const element = formElement.value
    const height = element.clientHeight // หรือใช้ offsetHeight ขึ้นอยู่กับความต้องการ

    auth.setFormElementHight(height);
}

const schema = z.object({
    email: z.string().email('email-policy-invalid'),
    password: z.string().min(1, 'password-policy-required')
})

type Schema = z.output<typeof schema>

const state = reactive({
    email: undefined,
    password: undefined
});

const createHiddenInput = (name: string, value: string): HTMLInputElement => {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = name;
  input.value = value;
  return input;
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  try {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `http://localhost:3002/api/v1/auth/login${auth.uri}`;
    form.style.display = 'none';

    form.appendChild(createHiddenInput('username', event.data.email));
    form.appendChild(createHiddenInput('password', event.data.password));
    form.appendChild(createHiddenInput('_csrf', xsrfToken.value || ''));

    document.body.appendChild(form);
    form.submit();
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};

</script>

<template>
    <div ref="formElement" class="max-w-[420px] w-full flex flex-col items-center justify-center gap-y-4">
        <NuxtImg src="/logo.png" class="w-[60px]" />
        <div class="flex flex-col justify-center gap-1 mt-6 w-full">
            <h1 class="text-[32px] font-bold text-primary-app dark:text-primary-app-400">{{ $t('sign-in-title') }}</h1>
            <p class="text-base">
                {{ $t('sign-in-description') }}
            </p>
        </div>
        <UForm :schema="schema" :state="state" class="space-y-2 w-full mt-4" @submit="onSubmit">
            <TFormGroup name="email">
                <UInput v-model="state.email" size="xl" inputClass="p-4" :placeholder="$t('email')" />
            </TFormGroup>
            <TFormGroup name="password" class="relative">
                <UInput v-model="state.password" size="xl" inputClass="p-4" :placeholder="$t('password')"
                    :type="auth.hiddenPassword ? 'password' : 'text'" />
                <span @click="auth.togglePasswordVisibility"
                    class="cursor-pointer text-gray-500 absolute dark:text-gray-400 z-50 top-[19px] right-4 flex justify-center items-center">
                    <UIcon :name="auth.hiddenPassword
                        ? 'i-heroicons-eye-20-solid'
                        : 'i-heroicons-eye-slash-20-solid'
                        " class="w-5 h-5" />
                </span>
            </TFormGroup>
            <div class="text-base pb-6">
                <NuxtLink @click="auth.setPageView('')" :to="`/forgotpassword${auth.uri}`" class="cursor-pointer -mt-1">
                    {{ $t('forgot-password') }}
                </NuxtLink @click="auth.setPageView('')">
            </div>
            <UButton type="submit" block size="xl" :padded="false" :ui="{ font: '!text-base' }"
                class="dark:text-slate-100 py-4">
                {{ $t('sign-in-title') }}
            </UButton>
        </UForm>
        <p class="text-center text-base">
            {{ $t('dont-have-account') }}
            <NuxtLink @click="auth.setPageView('')" :to="`/register${auth.uri}`"
                class="text-primary-app dark:text-primary-app-400 font-bold">
                {{  $t('sign-in-sign-up-link') }}
            </NuxtLink @click="auth.setPageView('')">
        </p>
        <p class="mt-4">
            {{ $t('thank-you-for-using') }}
        </p>
    </div>
</template>