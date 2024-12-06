<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
    <div class="h-full dark:bg-zinc-950">
        <div class="grid grid-cols-10">
            <!-- Left Section: Background Image -->
            <div class="hidden sm:block sm:col-span-5 lg:col-span-6 h-screen">
                <NuxtImg src="/bg.png" class="w-full h-full object-cover" alt="Background Image" />
            </div>
            <!-- Right Section: Slot Content -->
            <div
                class=" opacity-70 col-span-10 sm:col-span-5 lg:col-span-4 h-screen overflow-y-auto flex flex-col justify-center items-center px-4">
                <h1 class="text-8xl font-bold text-center">404</h1>
                <P class="text-xl">Not Found</P>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
