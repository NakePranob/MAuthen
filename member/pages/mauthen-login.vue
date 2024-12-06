<template>
    <div>
        <h1>Welcome to mauthen-login</h1>
        <!-- <button @click="logout">logout</button> -->
    </div>
</template>

<script lang="ts" setup>
// const accessToken = useCookie('accessToken')
    async function logout() {
        // const {data} = await useFetch('http://localhost:3002/api/v1/auth/logout', {
        //     method: 'POST',
        //     credentials: 'include',
        //     headers: {
        //         Authorization: 'Bearer YOUR_ACCESS_TOKEN',
        //     },
        // });
        // console.log(data.value); // อ่าน Cookie
console.log('Access Token:', useCookie('accessToken').value)
    }
</script>

<style></style>