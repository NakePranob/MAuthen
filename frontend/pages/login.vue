<script setup lang="ts">
import SignIn from '@/components/form/SignIn.vue';
import { useAuthStore } from '@/stores/auth'
import OTP from '@/components/form/OTP.vue';
import FormNoti from '@/components/form/FormNoti.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const queryParams = route.query;

const auth = useAuthStore();
const client_id = ref('Client Id');

onMounted(() => {
    client_id.value = new URLSearchParams(window.location.search).get('client_id') || '';
    const fullUri = `?${Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
        .join('&')}`;
    console.log(fullUri);
    auth.setUri(fullUri);
});
</script>

<template>
    <div v-if="!client_id">
        Required String parameter 'client_id' is not present
    </div>
    <div v-else class="max-w-[420px] w-full">
        <SignIn v-if="auth.pageView != 'otp' && !auth.notiSuccess.isOpen" />
        <OTP v-else-if="auth.pageView == 'otp'" />
        <FormNoti v-else-if="auth.notiSuccess.isOpen" />
    </div>
</template>