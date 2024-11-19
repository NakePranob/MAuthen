<template>
    <div class="max-w-[380px] w-full flex flex-col items-center justify-center">
        <NuxtImg src="/check.png" class="w-28" />
        <h1 class="text-3xl font-bold text-slate-700 dark:text-slate-100 mt-8">{{auth.notiSuccess.message}}</h1>
        <span class="text-slate-400 dark:text-slate-200 text-sm mt-2">
            {{ auth.notiSuccess.description }}
        </span>
        <div class="py-10">
            <Circular size="24" color="#E91C21" />
        </div>
        <span class="text-slate-400 dark:text-slate-200 text-sm">Redirecting in {{ secound }}</span>
    </div>
</template>

<script lang="ts" setup>
import Circular from '@/components/Circular.vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router'

const router = useRouter()

const auth = useAuthStore();

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