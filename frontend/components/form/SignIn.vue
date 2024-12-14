<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { useAuthStore } from '@/stores/auth';
import Circular from '@/components/Circular.vue';
const router = useRouter()

const toast = useToast();
const auth = useAuthStore();
const client_id = ref('');
const redirectUri = ref('');
const formElement = ref();
const xsrfToken = useCookie('XSRFTOKEN');
const isLoading = ref(false);

onMounted(() => {
    redirectUri.value = new URLSearchParams(window.location.search).get('redirect_uri') || '';
    client_id.value = new URLSearchParams(window.location.search).get('client_id') || '';
    getElementHeight();
});

const getElementHeight = () => {
    const element = formElement.value
    const height = element.clientHeight // หรือใช้ offsetHeight ขึ้นอยู่กับความต้องการ

    auth.setFormElementHight(height);
}

const schema = z.object({
    email: z.string({ message: "email-policy-required" }).email('email-policy-invalid'),
    password: z.string().min(1, 'password-policy-required')
})

type Schema = z.output<typeof schema>

const state = reactive({
    email: undefined,
    password: undefined
});



const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    if (isLoading.value) return;
    isLoading.value = true;

    try {
        const { data, error } = await useFetch(`http://localhost:3002/api/v1/auth/login${auth.uri}`, {
            method: 'POST',
            credentials: 'include',
            body: {
                username: event.data.email,
                password: event.data.password,
                _csrf: xsrfToken.value || '',
            },
        });

        if (error.value) {
            console.error('Error message from server:', error || 'Unknown error occurred');
            if (error.value.data.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
                toast.add({ title: error.value?.data.message });
                console.error('Error', error.value?.data);
                auth.setChangPassword({
                    session: error.value.data.Session,
                    email: error.value.data.ChallengeParameters.userAttributes.email,
                });
                auth.setPageView('changePassword');
            } else {
                toast.add({ title: error.value?.data.message });
            }
            return;
        }

        console.log('Response from server:', data.value);

        if (data.value) {
            auth.setPageView('otp');
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    } finally {
        isLoading.value = false; // ปิดสถานะกำลังโหลด
    }
};

</script>

<template>
    <div ref="formElement" class="max-w-[420px] w-full flex flex-col items-center justify-center gap-y-4">
        <NuxtImg src="/logo.png" class="w-[60px]" />
        <div class="flex flex-col justify-center gap-2 mt-6 w-full">
            <h1 class="text-[32px] font-bold text-primary-app dark:text-primary-app-400">{{ $t('sign-in-title') }}</h1>
            <p class="text-base">
                {{ $t('sign-in-description') }}
            </p>
        </div>
        <UForm :schema="schema" :state="state" class="space-y-4 w-full mt-4" @submit="onSubmit">
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
                <NuxtLink @click="auth.setPageView('')" :to="`/forgotpassword${auth.uri}`" class="cursor-pointer">
                    {{ $t('forgot-password') }}
                </NuxtLink @click="auth.setPageView('')">
            </div>
            <UButton
                :loading="isLoading"
                type="submit" block size="xl" :padded="false" :ui="{ font: '!text-base' }"
                class="dark:text-slate-100 py-4">
                <template v-if="isLoading" #leading>
                    <Circular size="16" color="white"/>
                </template>
                {{ $t('sign-in-title') }}
            </UButton>
        </UForm>
        <p class="text-center text-base mt-4">
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