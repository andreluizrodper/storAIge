<template>
  <div class="space-y-1 text-center">
    <h1 class="text-2xl font-semibold tracking-tight">Bem-vindo</h1>
    <p class="text-gray-500">Entre na sua conta!</p>
  </div>
  <UserAuthForm />
</template>

<script setup>
import UserAuthForm from "@/components/auth/sms-form.vue";
</script>
