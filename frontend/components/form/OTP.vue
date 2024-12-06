<script setup lang="ts">
import { z } from 'zod';
import { reactive, computed, onMounted, onUnmounted } from 'vue';
import type { FormSubmitEvent } from '#ui/types';
import { useAuthStore } from '@/stores/auth';
import type { LoginResponse } from '@/types/user';

const auth = useAuthStore();
const formElement = ref<HTMLFormElement | null>(null);
const client_id = ref('');
const redirectUri = ref('');

const schema = z.object({
    otp: z.string({ message: 'OTP is required' }).min(8, 'OTP must be at least 8 characters'),
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
        <div class="flex flex-col justify-center gap-1 mt-8 w-full">
            <h1 class="text-[32px] font-bold text-primary-app dark:text-primary-app-400">OTP Verification</h1>
            <p class="text-base">
                One-Time Password (OTP) has been sent via email to
            </p>
            <b class="text-primary-app dark:text-primary-app-400 font-bold text-base mb-2">{{ auth.otpEmail }}</b>
        </div>
        <UForm :schema="schema" :state="state" class="space-y-8 w-full" @submit="onSubmit">
            <UFormGroup name="otp" label="Enter the OTP (Ref code: csUkC0) below to verify it.">
                <UInput v-model="state.otp" size="xl" placeholder="Code" maxlength="8"
                    inputClass="text-center py-4 text-base mt-1" />
            </UFormGroup>
            <UFormGroup>
                <UButton type="submit" block size="xl" :padded="false" :ui="{
                    font: '!text-base',
                }" class="dark:text-slate-100 py-4">
                    Verify
                </UButton>
            </UFormGroup>
        </UForm>
        <div class="mt-6 flex flex-col items-center justify-center gap-1 text-base">
            <div class="flex-1 flex flex-col items-center justify-center">
                <span>Didn’t you receive any OTP? </span>
                <template v-if="!countdown.isFinished">
                    <b class="text-primary-app dark:text-primary-app-400 font-bold mt-1">
                        Resend OTP in {{ formattedCountdown }}
                    </b>
                </template>
                <template v-else>
                    <b @click="resetCountdown" class="text-primary-app hover:scale-105 cursor-pointer 
                    transition-all duration-150 ease-in-out dark:text-primary-app-400 font-bold mt-1">
                        Resend OTP
                    </b>
                </template>
            </div>
            <NuxtLink @click="auth.setPageView('')" :to="`/login${auth.uri}`" class="font-bold mt-6 flex gap-2 items-center">
                <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" /> Back to Sign In
            </NuxtLink>
        </div>
    </div>
</template>
