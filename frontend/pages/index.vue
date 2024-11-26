<script setup lang="ts">
import SignIn from '@/components/form/SignIn.vue';
import SignUp from '@/components/form/SignUp.vue';
import { useAuthStore } from '@/stores/auth'
import OTP from '@/components/form/OTP.vue';
import CodeVerification from '@/components/form/CodeVerification.vue';
import FormForgotPassword from '@/components/form/ForgotPassword.vue';
import FormSuccess from '@/components/form/FormSuccess.vue';
import ConfirmPassword from '@/components/form/ConfirmPassword.vue';

const auth = useAuthStore();

</script>

<template>
    <div class="grid grid-cols-10">
        <div class=" fixed top-4 left-4">
            <ColorScheme>
                <USelect v-model="$colorMode.preference" :options="['system', 'light', 'dark']" />
            </ColorScheme>
        </div>
        <div class="sm:col-span-5 lg:col-span-6 h-screen hidden sm:block">
            <NuxtImg src="/bg.jpg" class="w-full h-full object-cover" />
        </div>
        <div class="col-span-10 sm:col-span-5 lg:col-span-4 h-screen overflow-y-auto flex flex-col justify-center items-center py-8 px-4">
            <SignIn v-if="auth.pageView == 'signIn'"/>
            <SignUp v-else-if="auth.pageView == 'signUp'"/>
            <OTP v-else-if="auth.pageView == 'otp'"/>
            <CodeVerification v-else-if="auth.pageView == 'codeVerification'"/>
            <FormForgotPassword v-else-if="auth.pageView == 'forgotPassword'"/>
            <ConfirmPassword v-else-if="auth.pageView == 'confirmPassword'"/>
            <FormSuccess v-else-if="auth.notiSuccess.isOpen"/>
        </div>
    </div>
</template>