<script setup lang="ts">
import { z } from 'zod';
import { reactive, computed, onMounted, onUnmounted } from 'vue';
import type { FormSubmitEvent } from '#ui/types';
import { useAuthStore } from '@/stores/auth';
import type { LoginResponse } from '@/types/user';

const auth = useAuthStore();

const schema = z.object({
    otp: z.string({ message: 'OTP is required' }),
});

type Schema = z.output<typeof schema>;

const state = reactive({
    otp: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
    console.log(event.data);
    // const formData = {
    //     email: auth.otpEmail,
    //     otp: event.data.otp,
    // };

    // try {
    //     const { data } = await useFetch<LoginResponse>('http://localhost:8000/verify-otp', {
    //         method: 'POST',
    //         body: formData,
    //     });

    //     if (data.value?.message && data.value?.awsCredentials) {
    //         window.location.href = 'https://www.youtube.com/';
    //     } else {
    //         console.error('API response does not contain expected fields.');
    //     }
    // } catch (error) {
    //     console.error('Error submitting form:', error);
    // }
}

const countdown = reactive({
    timeLeft: 10 * 60, // 10 minutes (600 seconds)
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
    <div class="max-w-[380px] w-full flex flex-col items-center justify-center gap-y-4">
        <NuxtImg src="/logo.png" class="w-20" />
        <div class="flex flex-col justify-center gap-1 mt-8 w-full">
            <h1 class="text-3xl font-bold text-primary-app dark:text-primary-app-400">OTP Verification</h1>
            <small class="text-sm">
                One-Time Password (OTP) has been sent via email to
            </small>
            <b class="text-primary-app dark:text-primary-app-400 font-bold text-sm mb-2">{{ auth.otpEmail }}</b>
        </div>
        <UForm :schema="schema" :state="state" class="space-y-8 w-full" @submit="onSubmit">
            <UFormGroup name="otp" label="Enter the OTP below to verify it.">
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
            class="mt-6 flex flex-col items-center justify-center gap-1 text-sm">
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
