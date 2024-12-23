<template>
    <div class="w-80 text-center col-span-10 sm:col-span-5 lg:col-span-4 h-screen overflow-y-auto flex flex-col justify-center items-center px-4">
        <h1 class="text-8xl font-bold text-center text-primary">{{ code }}</h1>
        <P class="text-lg mt-4 ">{{ content }}</P>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    code: {
        type: String,
        default: '404',  // Default color
    },
    content: {
        type: String,
        default: 'Not Found',  // Default color
    }
});
</script>