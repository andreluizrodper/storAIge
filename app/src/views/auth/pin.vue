<template>
  <div class="space-y-1 text-center">
    <h1 class="text-2xl font-semibold tracking-tight">
      Você recebeu um código!
    </h1>
    <p class="text-gray-500 text-sm">{{ phone }}</p>
    <p class="text-gray-500 text-sm">
      Adicione o código para entrar na sua conta
    </p>
  </div>
  <UserPinForm />
</template>

<script>
import UserPinForm from "@/components/auth/sms-pin.vue";

export default {
  components: {
    UserPinForm,
  },
  computed: {
    phone() {
      return this.$store.state.phone;
    },
  },
};
</script>
