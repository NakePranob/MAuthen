<template>
    <div class="flex flex-col items-center justify-center gap-y-4">
        <NuxtImg src="/logo.png" class="w-16" />
        <div class="flex flex-col justify-center gap-1 mt-8 w-full">
            <h1 class="text-3xl font-bold text-primary-app dark:text-primary-app-400">OTP Verification</h1>
            <small class="text-sm">
                One-Time Password (OTP) has been sent via email to
            </small>
            <b class="text-primary-app dark:text-primary-app-400 font-bold text-sm mb-2">{{ auth.otpEmail }}</b>
        </div>
        <UForm :validate="validate" :state="state" class="space-y-8 w-full" @submit="onSubmit">
            <UFormGroup name="otp" label="Enter the OTP below to verify it.">
                <div class="flex justify-center gap-2 mt-2">
                    <input
                        v-for="(value, index) in state.otp"
                        :key="index"
                        type="text"
                        maxlength="1"
                        class="w-11 h-11 text-center border border-gray-300 focus:ring-primary-app focus:border-primary-app text-sm 
                        focus:outline focus:outline-2 focus:outline-primary-app rounded-md"
                        v-model="state.otp[index]"
                        @input="handleInput(index)"
                        @keydown.backspace="handleBackspace(index)"
                        ref="otpRefs"
                    />
                </div>
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

<script setup lang="ts">
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue';
import type { FormError, FormSubmitEvent } from '#ui/types';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

const state = reactive({
    otp: new Array(8).fill(''),
});

const validate = (state: any): FormError[] => {
    const errors = []
    if (!state.otp.every((value: string) => value.trim() !== '')) errors.push({ path: 'otp', message: 'Required' })
    
    return errors
}

const otpRefs = ref<HTMLInputElement[]>([]);

async function onSubmit(event: FormSubmitEvent<any>) {

    const otpValue = state.otp.join(''); // รวม OTP เป็น string
    console.log('otp', { otp: otpValue });

}

function handleInput(index: number) {
    if (state.otp[index].length === 1 && index < state.otp.length - 1) {
        otpRefs.value[index + 1]?.focus();
    }
}

function handleBackspace(index: number) {
    if (state.otp[index] === '' && index > 0) {
        otpRefs.value[index - 1]?.focus();
    }
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
