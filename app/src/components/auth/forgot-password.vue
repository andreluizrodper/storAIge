<template>
  <div class="grid gap-6">
    <form @submit.prevent="doForgotPassword">
      <div class="grid gap-2">
        <div class="grid gap-1">
          <Label class="sr-only" for="email"> Email </Label>
          <Input
            v-model="email"
            id="email"
            placeholder="Seu email"
            type="email"
            auto-capitalize="none"
            auto-complete="email"
            auto-correct="off"
            :disabled="isLoading"
          />
        </div>
        <Button :disabled="isLoading">
          <LoaderCircle v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          Pedir uma nova senha
        </Button>
      </div>
    </form>
    <Button variant="link" size="sm" as-child>
      <router-link
        class="text-gray-600 text-base text-center"
        :to="{ name: 'login' }"
      >
        Entrar na sua conta
      </router-link>
    </Button>
  </div>
</template>

<script>
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-vue-next";
import { useToast } from "@/components/ui/toast/use-toast";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/utils/firebase.js";

const { toast } = useToast();

export default {
  components: {
    Button,
    Input,
    Label,
    LoaderCircle,
  },
  data() {
    return {
      email: "",
      pwd: "",
      isLoading: false,
      error: false,
      message: "",
    };
  },
  methods: {
    async doForgotPassword() {
      this.isLoading = true;
      this.error = false;
      this.message = "";
      await sendPasswordResetEmail(auth, this.email);
      this.$store.commit("addToast", {
        title: "Pronto!",
        description:
          "Se você tiver uma conta, você receberá um email com instruções para redefinir sua senha.",
      });
      this.email = "";
      this.isLoading = false;
    },
  },
};
</script>
