<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore();
const formElement = ref();
const toast = useToast();
const errorMsg = useCookie('cognito-fl');
const session = ref();
const email = ref();

const validatePassword = ref<{
    path: string,
    message?: string,
}[]>([]);

const validate = (state: any): FormError[] => {
    const errors = []
    const errorsPassword = []
    if (!/[a-z]/.test(state.password) && auth.passwordPolicy.RequireLowercase) errorsPassword.push({ path: 'password', message: 'Password must contain a lower case letter'})
    if (!/[A-Z]/.test(state.password) && auth.passwordPolicy.RequireUppercase) errorsPassword.push({ path: 'password', message: 'Password must contain an upper case letter'})
    if (!/\d/.test(state.password) && auth.passwordPolicy.RequireNumbers) errorsPassword.push({ path: 'password', message: 'Password must contain a number'})
    if (!state.password || state.password.length < auth.passwordPolicy.MinimumLength) errorsPassword.push({ path: 'password', message: `Password must contain at least ${auth.passwordPolicy.MinimumLength} characters` })
    if (!/[!@#$%^&*(),.?":{}|<>_]/.test(state.password) && auth.passwordPolicy.RequireSymbols) errorsPassword.push({ path: 'password', message: 'Password must contain a special character or a space'})
    if (state.password.startsWith(' ') || state.password.endsWith(' ')) errorsPassword.push({ path: 'password', message: 'Password must not contain a leading or trailing space' })
    if (state.password != state.c_password) {
        errors.push({ path: 'c_password', message: ''})
        errorsPassword.push({ path: 'c_password', message: 'Password not match'})
    }
    
    if (errorsPassword.length > 0) errors.push({ path: 'password', message: '' })

    validatePassword.value = errorsPassword;
    return errors
}

const state = reactive({
    password: undefined,
    c_password: undefined,
})

async function onSubmit(event: FormSubmitEvent<any>) {
    if (validatePassword.value.some(error => error.path === 'password')) {
        return;
    }

    console.log(event.data)
    console.log("session", session.value)
    console.log("email", email.value)

    const formData = {
        session: session.value,
        username: email.value,
        password: event.data.password,
    }

    const {data, error} = await useFetch<{redirectUrl: string}>(`http://localhost:3002/api/v1/auth/newPassword${auth.uri}`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
    });

    if (error.value) {
        console.error("Error message from server:", error || "Unknown error occurred");
        toast.add({ title: error.value?.data.message });
        return;
    }
    
    if (data.value?.redirectUrl === undefined) return 

    auth.setPageView("");
    auth.setNotiSuccess({
        isOpen: true,
        state: 'success',
        url: data.value?.redirectUrl,
        message: 'noti-success-password-change-title',
        description: 'noti-success-password-change-description',
    });
}

const decodedBase64 = (token: string) => {
    // ตรวจสอบและเพิ่ม padding หากจำเป็น
    const paddedEncodedToken = token.padEnd(token.length + (4 - (token.length % 4)) % 4, '=');

    // ถอดรหัส Base64
    const decodedToken = atob(paddedEncodedToken);

    // แปลงข้อมูลจาก String เป็น JSON
    const decodedJson = JSON.parse(decodedToken);

    return decodedJson;
};

onMounted(() => {
    getElementHeight();
    if (errorMsg.value && !errorMsg.value.startsWith('W10')) {
        const err = decodedBase64(errorMsg.value);
        toast.add({ title: err.map.loginErrorMessage });
        errorMsg.value = btoa('[]');
        session.value = err.map.Session;
        email.value = err.map.ChallengeParameters.email;
        console.log(err);
    }
});

const getElementHeight = () => {
    if (formElement.value) {
        const height = formElement.value.offsetHeight;
        console.log('Height of the element:', height);
        auth.setFormElementHight(height);
    }
};

</script>

<template>
    <div class="max-w-[420px] w-full flex flex-col items-center justify-center">
        <NuxtImg src="/logo.png" class="w-[60px]" />
        <div class="flex flex-col justify-center gap-1 my-8 w-full">
            <h1 class="text-[32px] font-bold text-primary-app dark:text-primary-app-400">{{ $t('change-password-title') }}</h1>
            <p class="text-base">
                {{ $t('change-password-description') }}
            </p>
        </div>
        <UForm :validate="validate" :state="state" class="space-y-2 w-full" @submit="onSubmit">
            <TFormGroup name="password" class="relative">
                <UInput :placeholder="$t('password')" size="xl" inputClass="p-4" v-model="state.password"
                    :type="auth.hiddenPassword ? 'password' : 'text'" 
                    :color="validatePassword.length > 0 ? 'red' : undefined"/>
                <span @click="auth.togglePasswordVisibility"
                    class="cursor-pointer text-gray-500 absolute dark:text-gray-400 z-50 top-[19px] right-4 flex justify-center items-center">
                    <UIcon :name="auth.hiddenPassword
                        ? 'i-heroicons-eye-20-solid'
                        : 'i-heroicons-eye-slash-20-solid'
                        " class="w-5 h-5" />
                </span>
            </TFormGroup>
            <TFormGroup name="c_password" class="relative">
                <UInput :placeholder="$t('confirm-password')" size="xl" inputClass="p-4" v-model="state.c_password"
                    :type="auth.hiddenPassword ? 'password' : 'text'" 
                    :color="validatePassword.some(error => error.path === 'c_password') ? 'red' : undefined"/>
                <span @click="auth.togglePasswordVisibility"
                    class="cursor-pointer text-gray-500 absolute dark:text-gray-400 z-50 top-[19px] right-4 flex justify-center items-center">
                    <UIcon :name="auth.hiddenPassword
                        ? 'i-heroicons-eye-20-solid'
                        : 'i-heroicons-eye-slash-20-solid'
                        " class="w-5 h-5" />
                </span>
            </TFormGroup>
            <div class="text-xs flex flex-col justify-center transition-all duration-300 ease-in-out py-2"
            :class="state.password || state.c_password ? `h-[${auth.passwordPolicyHeight.toString()}px]` : 'h-0 opacity-0 overflow-hidden'">
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
                    <p
                        :class="validatePassword.some(error => error.message === 'Password must contain a special character or a space') ? 'text-red-500' : 'text-green-500'">
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
                <div class="flex items-center gap-1">
                    <p :class="validatePassword.some(error => error.message === 'Password not match') ? 'text-red-500' : 'text-green-500'">
                        <UIcon :name="validatePassword.some(error => error.message === 'Password not match')
                            ? 'i-heroicons-x-mark-20-solid'
                            : 'i-heroicons-check-20-solid'
                            " class="w-4 text-sm" />
                    </p>
                    {{ $t("password-policy-not-match") }}
                </div>
            </div>
            <div>
                <UButton type="submit" block size="xl" :padded="false" :ui="{
                    font: '!text-base',
                }" class="dark:text-slate-100 py-4">
                    {{ $t('continue-button') }}
                </UButton>
            </div>
        </UForm>
        <div class="mt-8 flex flex-col items-center justify-center gap-1 text-base">
            <NuxtLink @click="auth.setPageView('')" :to="`/login${auth.uri}`"
                class="font-bold mt-6 flex gap-2 hover:gap-4 transition-all duration-300 ease-in-out">
                <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" /> {{ $t('back-to-sign-in') }}
            </NuxtLink>
        </div>
    </div>
</template>