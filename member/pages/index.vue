<template>
  <div>
    <h1>Welcome to Customer Site</h1>
    <button @click="redirectToAuthServer">Login</button>
  </div>
</template>

<script lang="ts" setup>
    function redirectToAuthServer() {
        const redirectUri = encodeURIComponent('http://localhost:3001/callback'); // URL ของเว็บลูกค้า
        const state = 'random_state_value'; // ใช้สำหรับป้องกัน CSRF
        window.location.href = `http://localhost:3000/?redirect_uri=${redirectUri}&state=${state}`;
    }
</script>

<style>

</style>