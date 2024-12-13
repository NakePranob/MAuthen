<script setup lang="ts">
import { z } from 'zod';
import { reactive, computed, onMounted, onUnmounted } from 'vue';
import type { FormSubmitEvent } from '#ui/types';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const formElement = ref<HTMLFormElement | null>(null);
const client_id = ref('');
const redirectUri = ref('');
const email = ref('');

function maskEmail(email: string) {
  const [localPart, domain] = email.split("@");
  const maskedLocalPart = localPart[0] + "*".repeat(localPart.length - 1);
  const domainParts = domain.split(".");
  const maskedDomain = domainParts[0][0] + "*".repeat(domainParts[0].length - 1) + ".";
  return `${maskedLocalPart}@${maskedDomain}`;
}

const schema = z.object({
    otp: z.string({ message: 'otp-policy-required' }).min(8, 'otp-policy-length'),
});

type Schema = z.output<typeof schema>;

const state = reactive({
    otp: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
    console.log(event.data);
    // const formData = {
    //     username: auth.otpEmail,
    //     otp: event.data.otp,
    //     client_id: client_id.value,
    //     refresh_token: auth.refreshToken,
    // };

    // console.log('formData', formData);

    // try {
    //     const { data } = await useFetch<any>('http://localhost:3002/api/v1/auth/loginverify', {
    //         method: 'POST',
    //         body: formData,
    //         credentials: 'include',
    //     });

    //     console.log('data', data.value)

    //     // if (data.value?.message && data.value?.awsCredentials) {
    //     //     window.location.href = 'https://www.youtube.com/';
    //     // } else {
    //     //     console.error('API response does not contain expected fields.');
    //     // }
    // } catch (error) {
    //     console.error('Error submitting form:', error);
    // }
    window.location.href = 'https://www.youtube.com/';
}

const countdown = reactive({
    timeLeft: 10 * 60, // 10 minutes (600 seconds)
    isFinished: false, // เพิ่ม state เพื่อตรวจสอบว่าการนับสิ้นสุดหรือไม่
});

const formattedCountdown = computed(() => {
    const minutes = Math.floor(countdown.timeLeft / 60);
    const seconds = countdown.timeLeft % 60;
    return `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
});

let countdownInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
    redirectUri.value = new URLSearchParams(window.location.search).get('redirect_uri') || '';
    client_id.value = new URLSearchParams(window.location.search).get('client_id') || '';
    if (process.client) {
        nextTick(() => {
            startCountdown();
            getElementHeight();
        });
    }
    // email.value = maskEmail(auth.otpEmail);
    email.value = maskEmail("salkdad@sdaks.com");

});

const getElementHeight = () => {
    if (formElement.value) {
        const height = formElement.value.offsetHeight;
        console.log('Height of the element:', height);
        auth.setFormElementHight(height);
    }
};

onUnmounted(() => {
    stopCountdown();
});

function resetCountdown() {
    countdown.timeLeft = 10 * 60; // รีเซ็ตเวลาเป็น 10 นาที
    countdown.isFinished = false; // รีเซ็ตสถานะการนับ
    startCountdown(); // เริ่มนับใหม่
}

function startCountdown() {
    if (countdownInterval) return;
    countdownInterval = setInterval(() => {
        if (countdown.timeLeft > 0) {
            countdown.timeLeft -= 1;
        } else {
            countdown.isFinished = true; // ตั้งค่าเป็น true เมื่อเวลาสิ้นสุด
            stopCountdown();
        }
    }, 1000);
}

function stopCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}
</script>


<template>
    <div class="max-w-[420px] w-full flex flex-col items-center justify-center gap-y-4">
        <NuxtImg src="/logo.png" class="w-20" />
        <div class="flex flex-col justify-center gap-2 mt-6 mb-4 w-full">
            <h1 class="text-[32px] font-bold text-primary-app dark:text-primary-app-400">{{ $t('otp-verification-title') }}</h1>
            <p class="text-base">
                {{ $t('otp-verification-description') }}
                <b class="text-primary-app dark:text-primary-app-400 font-bold text-base mb-2">{{ email }}</b>
            </p>
        </div>
        <UForm :schema="schema" :state="state" class="space-y-8 w-full" @submit="onSubmit">
            <TFormGroup name="otp">
                <label>
                    {{ $t('otp-verification-label-leading') }} 
                    <b>{{ $t('otp-verification-label-center') }}</b> 
                    {{ $t('otp-verification-label-trailing') }}
                </label>
                <UInput v-model="state.otp" size="xl" :placeholder="$t('otp-verification-placeholder')" maxlength="8"
                    inputClass="text-center py-4 text-base mt-1" />
            </TFormGroup>
            <TFormGroup>
                <UButton type="submit" block size="xl" :padded="false" :ui="{
                    font: '!text-base',
                }" class="dark:text-slate-100 py-4">
                    Verify
                </UButton>
            </TFormGroup>
        </UForm>
        <div class="mt-4 flex flex-col items-center justify-center text-base">
            <div class="flex-1 flex flex-col items-center justify-center gap-2">
                <span>{{ $t('did-not-receive', {value: 'OTP'}) }}</span>
                <template v-if="!countdown.isFinished">
                    <b class="text-primary-app dark:text-primary-app-400 font-bold">
                        {{ $t('resend-otp-in') }} {{ formattedCountdown }}
                    </b>
                </template>
                <template v-else>
                    <b @click="resetCountdown" class="text-primary-app hover:scale-105 cursor-pointer 
                    transition-all duration-150 ease-in-out dark:text-primary-app-400 font-bold">
                    {{ $t('resend-otp') }}
                    </b>
                </template>
            </div>
            <span @click="auth.setPageView('')" class="font-bold mt-6 flex gap-2 items-center cursor-pointer
            transition-all duration-150 ease-in-out hover:gap-4">
                <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" /> {{ $t('back-to-sign-in') }}
            </span>
        </div>
    </div>
</template>
