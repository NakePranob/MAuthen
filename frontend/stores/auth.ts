import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => {
        return {
            formElementHight: 0,
            uri: '',
            refreshToken: '',
            hiddenPassword: true,
            pageView: '',
            otp: {
                email: '',
                password: '',
                challengeName: '',
                session: ''
            },
            codeVerification: {
                email: '',
                password: '',
                sessionId: '',
                code: ''
            },
            forgotPassword: {
                email: '',
                sessionId: ''
            },
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
            console.log(this.notiSuccess);
        },
        setOTP(obj: {
            email: string,
            password: string,
            challengeName: string,
            session: string
        }) {
            this.otp = obj;
        },
        setCodeVerification(obj: {
            email: string,
            password: string,
            sessionId: string,
            code: string
        }) {
            this.codeVerification = obj;
        },
        setForgotPassword(obj: {
            email: string,
            sessionId: string
        }) {
            this.forgotPassword = obj;
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