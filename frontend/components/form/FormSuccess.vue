<template>
    <div class="max-w-[420px] w-full flex flex-col items-center justify-center">
        <NuxtImg src="/check.png" class="w-28" />
        <h1 class="text-[32px] font-bold text-slate-700 dark:text-slate-100 mt-8">{{ auth.notiSuccess.message }}</h1>
        <span class="text-slate-400 dark:text-slate-200 text-base mt-2">
            {{ auth.notiSuccess.description }}
        </span>
        <div class="py-10">
            <Circular size="24" color="#E91C21" />
        </div>
        <span class="text-slate-400 dark:text-slate-200 text-base">Redirecting in {{ secound }}</span>
        <p @click="skip" class="flex items-center pt-10 gap-2 font-bold cursor-pointer">
            Skip
            <svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M13.25 6.87585L0.75 6.87585C0.58424 6.87585 0.425268 6.81001 0.308058 6.6928C0.190847 6.57559 0.125 6.41661 0.125 6.25085C0.125 6.08509 0.190847 5.92612 0.308058 5.80891C0.425268 5.6917 0.58424 5.62585 0.75 5.62585L13.25 5.62585C13.4158 5.62585 13.5747 5.6917 13.6919 5.80891C13.8092 5.92612 13.875 6.08509 13.875 6.25085C13.875 6.41661 13.8092 6.57559 13.6919 6.6928C13.5747 6.81001 13.4158 6.87585 13.25 6.87585Z"
                    fill="#231F20" />
                <path
                    d="M12.9901 6.2508L7.80638 1.0683C7.68902 0.950939 7.62309 0.791767 7.62309 0.625797C7.62309 0.459828 7.68902 0.300656 7.80638 0.183298C7.92374 0.0659389 8.08291 8.58307e-06 8.24888 8.58307e-06C8.41485 8.58307e-06 8.57402 0.0659389 8.69138 0.183298L14.3164 5.8083C14.3746 5.86635 14.4208 5.93532 14.4523 6.01126C14.4838 6.08719 14.5 6.16859 14.5 6.2508C14.5 6.33301 14.4838 6.41441 14.4523 6.49034C14.4208 6.56627 14.3746 6.63524 14.3164 6.6933L8.69138 12.3183C8.57402 12.4357 8.41485 12.5016 8.24888 12.5016C8.08291 12.5016 7.92374 12.4357 7.80638 12.3183C7.68902 12.2009 7.62309 12.0418 7.62309 11.8758C7.62309 11.7098 7.68902 11.5507 7.80638 11.4333L12.9901 6.2508Z"
                    fill="#231F20" />
            </svg>
        </p>
    </div>
</template>

<script lang="ts" setup>
import Circular from '@/components/Circular.vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router'

const router = useRouter()

const auth = useAuthStore();

function skip() {
    window.location.href = auth.notiSuccess.url;
}

function countdown(seconds: number) {
    let timeLeft = seconds;

    const intervalId = setInterval(() => {
        timeLeft--;
        secound.value = timeLeft;

        if (timeLeft < 0) {
            secound.value = 3;
            // router.push(auth.notiSuccess.url);
            window.location.href = auth.notiSuccess.url;
            clearInterval(intervalId);
        }
    }, 1000);
}

const secound = ref(3);
countdown(secound.value);
</script>