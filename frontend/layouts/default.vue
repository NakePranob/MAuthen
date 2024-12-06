<template>
    <div class="h-full dark:bg-zinc-950">
        <div class="grid grid-cols-10">
            <!-- Select Theme -->
            <div class="fixed top-4 left-4">
                <ColorScheme>
                    <USelect v-model="$colorMode.preference" :options="['system', 'light', 'dark']" />
                </ColorScheme>
            </div>
            <!-- Left Section: Background Image -->
            <div class="hidden sm:block sm:col-span-5 lg:col-span-6 h-screen">
                <NuxtImg src="/bg.png" class="w-full h-full object-cover" alt="Background Image" />
            </div>
            <!-- Right Section: Slot Content -->
            <div
                :class="auth.formElementHight < bodyHeight ? 'justify-center' : 'justify-start py-8'"
                class="col-span-10 sm:col-span-5 lg:col-span-4 h-screen overflow-y-auto flex flex-col items-center px-4">
                <slot />
            </div>
        </div>
        <UNotifications />
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore();
const bodyHeight = ref();

onMounted(()=>{
    bodyHeight.value = document.body.clientHeight
});
</script>

<style scoped>
div {
    font-family: "Noto Sans Thai", serif;
}
</style>
