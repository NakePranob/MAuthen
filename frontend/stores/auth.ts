import { defineStore } from 'pinia';
import { set } from 'zod';

export const useAuthStore = defineStore('auth', {
    state: () => {
        return { 
            hiddenPassword: true,
            pageView: 'signIn',
            otpEmail: '',
            notiSuccess: {
                isOpen: false,
                url: "",
                message: "",
                description: ""
            }
        };
    },
    actions: {
        togglePasswordVisibility() {
            this.hiddenPassword = !this.hiddenPassword;
        },
        setPageView(view: string) {
            this.pageView = view;
        },
        setNotiSuccess(obj: {
            isOpen: boolean,
            url: string,
            message: string,
            description: string
        }) {
            this.notiSuccess = obj;
        },
        setOtpEmail(email: string) {
            this.otpEmail = email;
        }
    }  
});