<script lang="ts" setup>
import FormNoti from '@/components/form/FormNoti.vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
</script>

<template>
    <div class="max-w-[420px] w-full">
        <FormNoti/>
    </div>
</template>