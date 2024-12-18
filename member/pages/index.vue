<template>
  <div>
    <h1>Welcome to Customer Site</h1>
    <button @click="redirectToAuthServer">Login</button>
    <button @click="register">register</button>
  </div>
</template>

<script lang="ts" setup>
// const client_id = '37av3n51eo6u8cbfqlgs74aomj';
const client_id = '7rm6dj73avbc4ukn6sf9fus910'


function generateRandomString(length: number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

function generateCustomRandomString() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const segmentLengths = [8, 8, 8, 8, 12]; // ความยาวแต่ละส่วนของข้อความ
  const separator = "-"; // ตัวคั่นระหว่างแต่ละส่วน
  
  let result = segmentLengths
    .map(length => {
      let segment = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        segment += characters[randomIndex];
      }
      return segment;
    })
    .join(separator);

  return result;
}


function redirectToAuthServer() {

  const redirectUrl = new URL('http://localhost:3002/api/v1/auth/authorize' as string);
        redirectUrl.searchParams.append("protocol", 'oauth2');
        redirectUrl.searchParams.append("response_type", 'token');
        redirectUrl.searchParams.append("access_type", '');
        redirectUrl.searchParams.append("client_id", client_id);
        redirectUrl.searchParams.append("redirect_uri", encodeURIComponent('http://localhost:3001/mauthen-login'));
        redirectUrl.searchParams.append("scope", "email openid phone profile");
        redirectUrl.searchParams.append("state", generateRandomString(10));
        redirectUrl.searchParams.append("code_challenge_method", 'S256');
        redirectUrl.searchParams.append("nonce", generateRandomString(10));
        redirectUrl.searchParams.append("code_challenge", generateCustomRandomString());
  window.location.href = redirectUrl.toString();
}
function register() {
  const redirectUrl = new URL('http://localhost:3000/register' as string);
        redirectUrl.searchParams.append("protocol", 'oauth2');
        redirectUrl.searchParams.append("response_type", 'token');
        redirectUrl.searchParams.append("access_type", '');
        redirectUrl.searchParams.append("client_id", client_id);
        redirectUrl.searchParams.append("redirect_uri", encodeURIComponent('http://localhost:3001/mauthen-login'));
        redirectUrl.searchParams.append("scope", "email openid phone profile");
        redirectUrl.searchParams.append("state", generateRandomString(10));
        redirectUrl.searchParams.append("code_challenge_method", 'S256');
        redirectUrl.searchParams.append("nonce", generateRandomString(10));
        redirectUrl.searchParams.append("code_challenge", generateCustomRandomString());
  window.location.href = redirectUrl.toString();
}
</script>

<style></style>