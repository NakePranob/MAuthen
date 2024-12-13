<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const formElement = ref();
const email = ref('');

function maskEmail(email: string) {
  const [localPart, domain] = email.split("@");
  const maskedLocalPart = localPart[0] + "*".repeat(localPart.length - 1);
  const domainParts = domain.split(".");
  const maskedDomain = domainParts[0][0] + "*".repeat(domainParts[0].length - 1) + ".";
  return `${maskedLocalPart}@${maskedDomain}`;
}

const schema = z.object({
    code: z.string({ message: 'code-policy-required' }),
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
        state: 'success',
        url: `http://localhost:3000/login${auth.uri}`,
        message: 'noti-success-sign-up-title',
        description: 'noti-success-sign-up-description',
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
    getElementHeight();
    if (process.client) {
        startCountdown();
        email.value = maskEmail(auth.emailForCodeVerification);
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
    <div class="max-w-[420px] w-full flex flex-col items-center justify-center">
        <NuxtImg src="/logo.png" class="w-20" />
        <div class="flex flex-col justify-center gap-2 my-8 w-full">
            <h1 class="text-[32px] font-bold text-primary-app dark:text-primary-app-400">{{ $t('code-verification-title') }}</h1>
            <p class="text-base">
                {{ $t('code-verification-description') }}
                <b class="text-primary-app dark:text-primary-app-400 font-bold">
                    {{ email }}
                </b> 
            </p>
        </div>
        <UForm :schema="schema" :state="state" class="space-y-8 w-full" @submit="onSubmit">
            <TFormGroup name="code" :label="$t('code-verification-label')">
                <UInput v-model="state.code" size="xl" inputClass="text-center py-4 text-base mt-1" :placeholder="$t('code-verification-placeholder')"/>
            </TFormGroup>
            <UButton type="submit" block size="xl" :padded="false" :ui="{font: '!text-base'}" 
            class="dark:text-slate-100 py-4">
                {{ $t('verify-button') }}
            </UButton>
        </UForm>
        <div
            class="mt-8 flex flex-col items-center justify-center text-base">
            <div class="flex-1 flex flex-col items-center justify-center gap-2">
                <span>{{ $t('did-not-receive', {value: 'Code'}) }}</span>
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
            <NuxtLink @click="auth.setPageView('')" :to="`/login${auth.uri}`" class="font-bold mt-8 flex gap-2 items-center">
                <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" /> {{ $t('back-to-sign-in') }}
            </NuxtLink>
        </div>
    </div>
</template>
