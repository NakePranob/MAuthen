<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useAuthStore } from '#build/imports';
const auth = useAuthStore()

const schema = z.object({
    email: z.string({ message: 'Required' }).email('Invalid email'),
    password: z.string().min(8, 'Must be at least 8 characters'),
    firstName: z.string({ message: 'Required' }),
    LastName: z.string({ message: 'Required' }),
    jobPosition: z.string({ message: 'Required' }),
    company: z.string({ message: 'Required' }),
    phoneNumber: z.string({ message: 'Required' }),
})

type Schema = z.output<typeof schema>

const state = reactive({
    email: undefined,
    password: undefined,
    firstName: undefined,
    LastName: undefined,
    jobPosition: undefined,
    company: undefined,
    phoneNumber: undefined,
    country: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    // Do something with event.data
    console.log(event.data)

    auth.setPageView('codeVerification')
}

const country = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina",
    "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
    "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana",
    "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon",
    "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)",
    "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Denmark", "Djibouti", "Dominica",
    "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
    "Eswatini (fmr. 'Swaziland')", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia",
    "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti",
    "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
    "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea (North)", "Korea (South)",
    "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
    "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
    "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro",
    "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands",
    "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia (formerly Macedonia)", "Norway",
    "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru",
    "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
    "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
    "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
    "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname",
    "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
    "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
    "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam",
    "Yemen", "Zambia", "Zimbabwe"
];

const selected = ref(country[171])
</script>

<template>
    <div class="max-w-[550px] w-full flex flex-col">
        <div class="flex justify-between w-full">
            <div>
                <h1 class="text-3xl font-bold text-slate-700 dark:text-slate-100">Sign Up</h1>
                <small class="text-slate-400 dark:text-slate-200 mt-8 mb-8 text-sm">Sign up with a new
                    account</small>
            </div>
            <div>
                <NuxtImg src="/logo.png" class="w-32 -mt-4" />
            </div>
        </div>
        <UForm :schema="schema" :state="state" class="w-full" @submit="onSubmit">
            <div class="grid grid-cols-1 lg:grid-cols-2">
                <div class="col-span-1 space-y-4 pb-10">
                    <h4 class="font-bold text-slate-700 dark:text-slate-100 text-xl">Login Credential</h4>
                    <UFormGroup name="email">
                        <UInput v-model="state.email" size="xl" inputClass="p-4" placeholder="Email" />
                    </UFormGroup>
                    <UFormGroup name="password" class="relative">
                        <UInput placeholder="Password" size="xl" inputClass="p-4" v-model="state.password"
                            :type="auth.hiddenPassword ? 'password' : 'text'" />
                        <span @click="auth.togglePasswordVisibility"
                            class="cursor-pointer text-gray-500 absolute dark:text-gray-400 z-50 top-[19px] right-4 flex justify-center items-center">
                            <UIcon :name="auth.hiddenPassword
                                ? 'i-heroicons-eye-20-solid'
                                : 'i-heroicons-eye-slash-20-solid'
                                " class="w-5 h-5" />
                        </span>
                    </UFormGroup>
                </div>
            </div>
            <h4 class="font-bold text-slate-700 dark:text-slate-100 text-xl mb-4">
                Account Information
            </h4>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <UFormGroup name="firstName">
                    <UInput v-model="state.firstName" size="xl" inputClass="p-4" placeholder="First Name" class="col-span-1" />
                </UFormGroup>
                <UFormGroup name="LastName">
                    <UInput v-model="state.LastName" size="xl" inputClass="p-4" placeholder="Last Name" class="col-span-1" />
                </UFormGroup>
                <UFormGroup name="jobPosition">
                    <UInput v-model="state.jobPosition" size="xl" inputClass="p-4" placeholder="Job Position" class="col-span-1" />
                </UFormGroup>
                <UFormGroup name="company">
                    <UInput v-model="state.company" size="xl" inputClass="p-4" placeholder="Company" class="col-span-1" />
                </UFormGroup>
                <UFormGroup name="phoneNumber">
                    <UInput v-model="state.phoneNumber" size="xl" inputClass="p-4" placeholder="Phone Number" class="col-span-1" />
                </UFormGroup>
                <UFormGroup name="country">
                    <USelectMenu v-model="selected" size="xl" selectClass="!p-4" :options="country" class="col-span-1" 
                    searchable searchable-placeholder="Search a country..."/>
                </UFormGroup>
                <UFormGroup class="mt-8">
                    <UButton type="submit" block size="xl" :padded="false" :ui="{font: '!text-sm'}" 
                    class="dark:text-slate-100 py-4">
                        Sign Up
                    </UButton>
                </UFormGroup>
            </div>
        </UForm>
        <div class="mt-2 w-full">
            <span class="text-slate-400 dark:text-slate-200 text-sm ">
                Already have an account? 
                <button @click="auth.setPageView('signIn')" type="button" class="text-primary-app dark:text-primary-app-400 font-bold">
                    Sign In
                </button>
            </span>
        </div>
    </div>
</template>