<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import { useAuthStore } from '@/stores/auth'

const toast = useToast();
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
    const errors = [];
    const errorsPassword = [];
    if (!state.email) {
        errors.push({ path: 'email', message: 'email-policy-required' })
    } else if (!/@/.test(state.email)) {
        errors.push({ path: 'email', message: 'email-policy-invalid' })
    } else if (state.email.includes('themall.co.th') || state.email.includes('emporiumthailand.com')) {
        errors.push({ path: 'email', message: 'email-policy-is-themall-or-emporiumthailand' })
    }
    if (!state.password) errorsPassword.push({ path: 'password', message: '' })
    if (!/[a-z]/.test(state.password) && auth.passwordPolicy.RequireLowercase) errorsPassword.push({ path: 'password', message: 'Password must contain a lower case letter' })
    if (!/[A-Z]/.test(state.password) && auth.passwordPolicy.RequireUppercase) errorsPassword.push({ path: 'password', message: 'Password must contain an upper case letter' })
    if (!/\d/.test(state.password) && auth.passwordPolicy.RequireNumbers) errorsPassword.push({ path: 'password', message: 'Password must contain a number' })
    if (!state.password || state.password.length < auth.passwordPolicy.MinimumLength) errorsPassword.push({ path: 'password', message: `Password must contain at least ${auth.passwordPolicy.MinimumLength} characters` })
    if (!/[!@#$%^&*(),.?":{}|<>_]/.test(state.password) && auth.passwordPolicy.RequireSymbols) errorsPassword.push({ path: 'password', message: 'Password must contain a special character or a space' })
    if (/^\s|\s$/.test(state.password)) errorsPassword.push({ path: 'password', message: 'Password must not contain a leading or trailing space' })

    if (errorsPassword.length > 0) errors.push({ path: 'password', message: '' })


    validatePassword.value = errorsPassword;
    return errors
}

const state = reactive({
    email: undefined,
    password: undefined,
})

async function onSubmit(event: FormSubmitEvent<any>) {
    // Do something with event.data
    console.log(event.data);
    const formData = {
        username: event.data.email,
        password: event.data.password,
    }
    const { data, error } = await useFetch(`http://localhost:3002/api/v1/auth/register${auth.uri}`, {
        method: "POST",
        body: formData,
    });

    if (error.value) {
        console.error("Error message from server:", error || "Unknown error occurred");
        toast.add({ title: error.value?.data.message });
        return;
    }

    console.log("Response from server:", data.value);

    auth.setEmailForCodeVerification(event.data.email);
    auth.setPageView('codeVerification');
}

</script>

<template>
    <div class="max-w-[420px] w-full flex flex-col items-center justify-center gap-y-4">
        <NuxtImg src="/logo.png" class="w-[60px]" />
        <div class="flex flex-col justify-center gap-2 mt-6 w-full">
            <h1 class="text-[32px] font-bold text-primary-app dark:text-primary-app-400">{{ $t('sign-up-title') }}</h1>
            <p class="text-base">
                {{ $t('sign-up-description') }}
            </p>
        </div>
        <UForm :validate="validate" :state="state" class="space-y-4 w-full mt-4" @submit="onSubmit">
            <TFormGroup name="email">
                <UInput v-model="state.email" size="xl" inputClass="p-4" :placeholder="$t('email')" />
            </TFormGroup>
            <TFormGroup class="relative" name="password">
                <UInput v-model="state.password" size="xl" inputClass="p-4" :placeholder="$t('password')"
                    :type="auth.hiddenPassword ? 'password' : 'text'"
                    :color="validatePassword.length > 0 ? 'red' : undefined" />
                <p @click="auth.togglePasswordVisibility"
                    class="cursor-pointer text-gray-500 absolute dark:text-gray-400 z-50 top-[19px] right-4 flex justify-center items-center">
                    <UIcon :name="auth.hiddenPassword
                        ? 'i-heroicons-eye-20-solid'
                        : 'i-heroicons-eye-slash-20-solid'
                        " class="w-5 h-5" />
                </p>
            </TFormGroup>
            <div class="text-xs transition-all duration-300 ease-in-out overflow-hidden"
                :style="{
                    maxHeight: state.password ? `${auth.passwordPolicyHeight}px` : '0',
                    opacity: state.password ? '1' : '0',
                    marginBottom: state.password ? '32px' : '0',
                }">
                <div v-if="auth.passwordPolicy.RequireLowercase" class="flex items-center gap-1">
                    <p :class="validatePassword.some(error => error.message === 'Password must contain a lower case letter') ? 'text-red-500' : 'text-green-500'">
                        <UIcon :name="validatePassword.some(error => error.message === 'Password must contain a lower case letter')
                            ? 'i-heroicons-x-mark-20-solid'
                            : 'i-heroicons-check-20-solid'
                            " class="w-4 text-sm" />
                    </p>
                    {{ $t('password-policy-lowercase') }}
                </div>
                <div v-if="auth.passwordPolicy.RequireUppercase" class="flex items-center gap-1">
                    <p :class="validatePassword.some(error => error.message === 'Password must contain an upper case letter') ? 'text-red-500' : 'text-green-500'">
                        <UIcon :name="validatePassword.some(error => error.message === 'Password must contain an upper case letter')
                            ? 'i-heroicons-x-mark-20-solid'
                            : 'i-heroicons-check-20-solid'
                            " class="w-4 text-sm" />
                    </p>
                    {{  $t('password-policy-uppercase') }}
                </div>
                <div v-if="auth.passwordPolicy.RequireNumbers" class="flex items-center gap-1">
                    <p :class="validatePassword.some(error => error.message === 'Password must contain a number') ? 'text-red-500' : 'text-green-500'">
                        <UIcon :name="validatePassword.some(error => error.message === 'Password must contain a number')
                            ? 'i-heroicons-x-mark-20-solid'
                            : 'i-heroicons-check-20-solid'
                            " class="w-4 text-sm" />
                    </p>
                    {{ $t('password-policy-number') }}
                </div>
                <div class="flex items-center gap-1">
                    <p :class="validatePassword.some(error => error.message === `Password must contain at least ${auth.passwordPolicy.MinimumLength} characters`) ? 'text-red-500' : 'text-green-500'">
                        <UIcon :name="validatePassword.some(error => error.message === `Password must contain at least ${auth.passwordPolicy.MinimumLength} characters`)
                            ? 'i-heroicons-x-mark-20-solid'
                            : 'i-heroicons-check-20-solid'
                            " class="w-4 text-sm" />
                    </p>
                    {{ $t('password-policy-length', { length: auth.passwordPolicy.MinimumLength }) }}
                </div>
                <div v-if="auth.passwordPolicy.RequireSymbols" class="flex items-center gap-1">
                    <p :class="validatePassword.some(error => error.message === 'Password must contain a special character or a space') ? 'text-red-500' : 'text-green-500'">
                        <UIcon :name="validatePassword.some(error => error.message === 'Password must contain a special character or a space')
                            ? 'i-heroicons-x-mark-20-solid'
                            : 'i-heroicons-check-20-solid'
                            " class="w-4 text-sm" />
                    </p>
                    {{ $t('password-policy-symbol') }}
                </div>
                <div class="flex items-center gap-1">
                    <p :class="validatePassword.some(error => error.message === 'Password must not contain a leading or trailing space') ? 'text-red-500' : 'text-green-500'">
                        <UIcon :name="validatePassword.some(error => error.message === 'Password must not contain a leading or trailing space')
                            ? 'i-heroicons-x-mark-20-solid'
                            : 'i-heroicons-check-20-solid'
                            " class="w-4 text-sm" />
                    </p>
                    {{ $t("password-policy-not-space-leading-trailing") }}
                </div>
            </div>
            <UButton type="submit" block size="xl" :padded="false" :ui="{ font: '!text-base' }"
                class="dark:text-slate-100 py-4">
                {{ $t('sign-up-title') }}
            </UButton>
        </UForm>
        <div class="mt-4 w-full flex justify-center">
            <p class="text-base">
                {{ $t('already-have-account') }} 
                <NuxtLink @click="auth.setPageView('')" :to="`/login${auth.uri}`"
                    class="text-primary-app dark:text-primary-app-400 font-bold">
                    {{ $t('sign-in-title') }}
                </NuxtLink>
            </p>
        </div>
    </div>
</template>