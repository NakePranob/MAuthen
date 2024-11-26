<script lang="ts" setup>
import SignInLatest from '@/components/form/SignInLatest.vue';
</script>

<template>
    <div class="bg-left-bottom h-screen bg-cover bg-no-repeat flex sm:justify-center lg:justify-end items-center lg:pe-24"
        style="background-image: url('/full-bg.jpg');">
        <UCard class="h-screen overflow-y-auto w-screen sm:h-auto sm:w-auto 
            flex flex-col items-center justify-center sm:p-4 rounded-none sm:rounded-3xl">
            <SignInLatest />
        </UCard>
    </div>
</template>