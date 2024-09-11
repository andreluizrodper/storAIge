<template>
  <div class="space-y-1 text-center">
    <h1 class="text-2xl font-semibold tracking-tight">Criar a sua conta</h1>
    <p class="text-gray-500 text-sm">
      {{ inviter?.name ?? "..." }} te convidou para vocês melhorarem como casal!
    </p>
  </div>
  <UserAuthForm />
</template>

<script>
import UserAuthForm from "@/components/auth/invite.vue";
import { getAccount } from "@/utils/account";

export default {
  components: {
    UserAuthForm,
  },
  data() {
    return {
      inviter: null,
    };
  },
  async mounted() {
    this.inviter = await getAccount({
      id: this.$route.params.account_id,
      setStore: false,
    });
    this.$store.commit("setCreateCouple", this.$route.params.account_id);
  },
};
</script>
