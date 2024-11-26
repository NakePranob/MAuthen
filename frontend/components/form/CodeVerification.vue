<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

const schema = z.object({
    code: z.string({ message: 'Required' }),
})

type Schema = z.output<typeof schema>

const state = reactive({
    code: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    console.log(event.data)
    auth.setPageView("");
    auth.setNotiSuccess({
        isOpen: true,
        url: 'https://www.youtube.com/',
        message: 'Sign Up Successfully',
        description: 'Your email was confirmed and you are now logged in.',
    });
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
    if (process.client) {
        startCountdown();
    }
});

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
    <div class="max-w-[380px] w-full flex flex-col items-center justify-center">
        <NuxtImg src="/logo.png" class="w-20" />
        <div class="flex flex-col justify-center gap-1 mt-8 w-full">
            <h1 class="text-3xl font-bold text-primary-app dark:text-primary-app-400">Code Verification</h1>
            <small class="text-sm">
                Code Verification has been sent via email to
            </small>
            <b class="text-primary-app dark:text-primary-app-400 font-bold text-sm mb-2">{{ auth.otpEmail }}</b>
        </div>
        <UForm :schema="schema" :state="state" class="space-y-8 w-full" @submit="onSubmit">
            <UFormGroup name="code" label="Enter the Code below to verify it.">
                <UInput v-model="state.code" size="xl" inputClass="text-center py-4 text-sm mt-1" placeholder="Code"/>
            </UFormGroup>
            <UButton type="submit" block size="xl" :padded="false" :ui="{font: '!text-sm'}" 
            class="dark:text-slate-100 py-4">
                Verify
            </UButton>
        </UForm>
        <div
            class="mt-8 flex flex-col items-center justify-center gap-1 text-sm">
            <div class="flex-1 flex flex-col items-center justify-center">
                <span>Didn’t you receive any Code? </span>
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
            <button @click="auth.setPageView('signIn')" type="button" class="font-bold mt-4 flex gap-2">
                <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" /> Back to Sign In
            </button>
        </div>
    </div>
</template>
