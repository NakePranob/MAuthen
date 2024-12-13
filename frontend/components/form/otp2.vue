<template>
    <div class="flex flex-col items-center justify-center gap-y-4">
        <NuxtImg src="/logo.png" class="w-[60px]" />
        <div class="flex flex-col justify-center gap-1 mt-6 w-full">
            <h1 class="text-[32px] font-bold text-primary-app dark:text-primary-app-400">OTP Verification</h1>
            <p class="text-base">
                One-Time Password (OTP) has been sent via email to
            </p>
            <b class="text-primary-app dark:text-primary-app-400 font-bold text-base mb-2">{{ auth.otpEmail }}</b>
        </div>
        <UForm :validate="validate" :state="state" class="space-y-8 w-full" @submit="onSubmit">
            <TFormGroup name="otp" label="Enter the OTP below to verify it.">
                <div class="flex justify-center gap-2 mt-2">
                    <input
                        v-for="(value, index) in state.otp"
                        :key="index"
                        type="text"
                        maxlength="1"
                        class="w-11 h-11 text-center border border-gray-300 focus:ring-primary-app focus:border-primary-app text-base 
                        focus:outline focus:outline-2 focus:outline-primary-app rounded-md"
                        v-model="state.otp[index]"
                        @input="handleInput(index)"
                        @keydown.backspace="handleBackspace(index)"
                        ref="otpRefs"
                    />
                </div>
            </TFormGroup>
            <TFormGroup>
                <UButton type="submit" block size="xl" :padded="false" :ui="{
                font: '!text-base',
                }" class="dark:text-slate-100 py-4">
                    Verify
                </UButton>
            </TFormGroup>
        </UForm>
        <div
            class="mt-6 flex flex-col items-center justify-center gap-1 text-base">
            <div class="flex-1 flex flex-col items-center justify-center">
                <span>Didn’t you receive any OTP? </span>
                <b class="text-primary-app dark:text-primary-app-400 font-bold mt-1">Resend OTP in {{formattedCountdown}}</b>
            </div>
            <NuxtLink @click="auth.setPageView('')" :to="`/login${auth.uri}`" class="font-bold mt-6 flex gap-2 items-center">
                <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" /> {{ $t('back-to-sign-in') }}
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue';
import type { FormError, FormSubmitEvent } from '#ui/types';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const formElement = ref();

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
    getElementHeight();
    if (process.client) {
        startCountdown();
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
