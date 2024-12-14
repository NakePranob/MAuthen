import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => {
        return {
            formElementHight: 0,
            uri: '',
            refreshToken: '',
            hiddenPassword: true,
            pageView: '',
            otpEmail: '',
            emailForCodeVerification: '',
            emailForgotPassword: '',
            changPassword: {
                session: '',
                email: ''
            },
            notiSuccess: {
                isOpen: false,
                state: "",
                url: "",
                message: "",
                description: ""
            },
            passwordPolicy: {
                MinimumLength: 6,
                RequireUppercase: false,
                RequireLowercase: false,
                RequireSymbols: false,
                RequireNumbers: false,
            },
            passwordPolicyHeight: 36
        };
    },
    actions: {
        setFormElementHight(height: number) {
            this.formElementHight = height;
        },
        setRefreshToken(token: string) {
            this.refreshToken = token;
        },
        togglePasswordVisibility() {
            this.hiddenPassword = !this.hiddenPassword;
        },
        setPageView(view: string) {
            this.pageView = view;
            console.log("setPageView:", view)
        },
        setNotiSuccess(obj: {
            isOpen: boolean,
            state: string,
            url: string,
            message: string,
            description: string
        }) {
            this.notiSuccess = obj;
        },
        setOtpEmail(email: string) {
            this.otpEmail = email;
        },
        setEmailForCodeVerification(email: string) {
            this.emailForCodeVerification = email;
        },
        setEmailForgotPassword(email: string) {
            this.emailForgotPassword = email;
        },
        setChangPassword(obj: {
            session: string,
            email: string
        }) {
            this.changPassword = obj;
        },
        setPasswordPolicy(obj: {
            MinimumLength: number,
            RequireUppercase: boolean,
            RequireLowercase: boolean,
            RequireSymbols: boolean,
            RequireNumbers: boolean,
        } | null | undefined) {
            if (obj) {
                this.passwordPolicy = obj;
            }
        },
        setPasswordPolicyHeight(height: number) {
            this.passwordPolicyHeight = height;
        },
        setUri(uri: string) {
            this.uri = uri;
        }
    },
    getters: {
        getClientUri() {
            return new URLSearchParams(window.location.search).get('client_id') || '';
        }
    }  
});