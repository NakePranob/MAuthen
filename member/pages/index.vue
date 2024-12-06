<template>
  <div>
    <h1>Welcome to Customer Site</h1>
    <button @click="redirectToAuthServer">Login</button>
    <button @click="register">register</button>
  </div>
</template>

<script lang="ts" setup>
const client_id = '37av3n51eo6u8cbfqlgs74aomj';
function redirectToAuthServer() {
  const redirectUri = encodeURIComponent('http://localhost:3001/mauthen-login'); // URL ของเว็บลูกค้า
  const state = 'random_state_value'; // ใช้สำหรับป้องกัน CSRF
  window.location.href = `http://localhost:3002/api/v1/auth/authorize?response_type=token&client_id=${client_id}&redirect_uri=${redirectUri}&state=${state}&scope=email%20openid%20phone%20profile`;
}
function register() {
  const redirectUri = encodeURIComponent('http://localhost:3001/mauthen-login');
  const state = 'random_state_value';
  window.location.href = `http://localhost:3000/register?response_type=token&client_id=${client_id}&redirect_uri=${redirectUri}&state=${state}&scope=email%20openid%20phone%20profile`;
}
</script>

<style></style>