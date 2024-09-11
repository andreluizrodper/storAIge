<template>
  <div
    v-if="loading"
    class="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-white"
  >
    <Loading />
  </div>
  <RouterView v-if="!loading" />
  <Toaster />
</template>

<script>
import Loading from "@/components/ui/loading.vue";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase.js";
import { RouterView } from "vue-router";
import { loginAccount, accountExists, createAccount } from "@/utils/account.js";
import Toaster from "@/components/ui/toast/Toaster.vue";

export default {
  components: {
    Loading,
    RouterView,
    Toaster,
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
  },
  data() {
    return {
      loading: true,
    };
  },
  name: "App",
  created() {
    this.$store.commit(
      "setTheme",
      window.localStorage.getItem("theme_veaconta") || "light"
    );
    onAuthStateChanged(auth, async (user) => {
      if (user && !this.account) {
        const checkAccountExists = await accountExists({ id: user.uid });
        if (checkAccountExists) {
          this.$store.commit("setUser", user);
          await loginAccount({ id: user.uid });
          if (this.$route.path === "/") {
            this.$router.push({ name: "feed" });
          }
          this.loading = false;
        } else {
          this.loading = false;
        }
      } else {
        this.loading = false;
      }
    });
  },
};
</script>
