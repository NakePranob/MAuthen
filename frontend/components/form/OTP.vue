<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useAuthStore } from '@/stores/auth'
import type { LoginResponse } from '@/types/user'
const auth = useAuthStore()

const schema = z.object({
    otp: z.string({ message: 'OTP is required' }),
})

type Schema = z.output<typeof schema>

const state = reactive({
    otp: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    // Do something with event.data
    console.log(event.data)
    const formData = {
        email: auth.otpEmail,
        otp: event.data.otp
    }
    // try {
    //     const { data } = await useFetch<LoginResponse>('http://localhost:8000/verify-otp', {
    //         method: 'POST',
    //         body: formData
    //     });

    //     console.log("response:", data.value);

    //     if (data.value?.message && 
    //         data.value?.awsCredentials.AccessKeyId && 
    //         data.value?.awsCredentials.SecretAccessKey && 
    //         data.value?.awsCredentials.SessionToken
    //     ) {
    //         console.log("message:", data.value.message);
    //         window.location.href = 'https://www.youtube.com/';
    //     } else {
    //         console.error('API response does not contain expected fields.');
    //     }

    // } catch (error) {
    //     console.error('Error submitting form:', error);
    // }
    window.location.href = 'https://www.youtube.com/';
}

const countdown = reactive({
    timeLeft: 10 * 60, // 10 นาที (600 วินาที)
});

const formattedCountdown = computed(() => {
    const minutes = Math.floor(countdown.timeLeft / 60);
    const seconds = countdown.timeLeft % 60;
    return `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
});

let countdownInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
    startCountdown();
});

onUnmounted(() => {
    stopCountdown();
});

function startCountdown() {
    if (countdownInterval) return;
    countdownInterval = setInterval(() => {
        if (countdown.timeLeft > 0) {
            countdown.timeLeft -= 1;
        } else {
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
        <NuxtImg src="/logo.png" class="w-40" />
        <div class="flex flex-col items-center justify-center gap-1">
            <h1 class="text-3xl font-bold text-slate-700 dark:text-slate-100">OTP Verification</h1>
            <small class="text-slate-400 dark:text-slate-200 text-sm">
                One-Time Password (OTP) has been sent via email to
            </small>
            <b class="text-primary-app dark:text-primary-app-400 font-bold text-sm mb-8">{{ auth.otpEmail }}</b>
        </div>
        <UForm :schema="schema" :state="state" class="space-y-8 w-full" @submit="onSubmit">
            <UFormGroup name="otp">
                <label for="v-1" class="text-slate-400 dark:text-slate-200 text-sm">
                    Enter the OTP below to verify it.
                </label>
                <UInput v-model="state.otp" size="xl" placeholder="OTP" maxlength="8" inputClass="text-center py-4 text-sm mt-1" />
            </UFormGroup>
            <UFormGroup>
                <UButton type="submit" block size="xl" :padded="false" :ui="{
                font: '!text-sm',
                }" class="dark:text-slate-100 py-4">
                    Verify
                </UButton>
            </UFormGroup>
        </UForm>
        <div
            class="mt-8 flex flex-col items-center justify-center gap-1 text-sm text-slate-400 dark:text-slate-200">
            <div class="flex-1 flex flex-col items-center justify-center">
                <span>Didn’t you receive any OTP? </span>
                <b class="text-primary-app dark:text-primary-app-400 font-bold mt-1">Resend OTP in {{formattedCountdown}}</b>
            </div>
            <button @click="auth.setPageView('signIn')" type="button" class="font-bold mt-4 flex gap-2">
                <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" /> Back to Sign In
            </button>
        </div>
    </div>
</template>
