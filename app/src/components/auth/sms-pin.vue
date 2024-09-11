<template>
  <div class="flex flex-col items-center justify-center gap-4">
    <PinInput
      id="pin-input"
      v-model="value"
      placeholder="-"
      @complete="handleComplete"
    >
      <PinInputGroup>
        <PinInputInput v-for="(id, index) in 6" :key="id" :index="index" />
      </PinInputGroup>
    </PinInput>
    <Loading v-if="loading" />
    <Button variant="link" as-child>
      <router-link :to="{ name: 'login' }"
        >Solicitar um novo código</router-link
      >
    </Button>
  </div>
</template>

<script>
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-vue-next";
import Loading from "@/components/ui/loading.vue";
import { loginAccount, createAccount, accountExists } from "@/utils/account.js";
import { createCouple } from "@/utils/couple.js";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/utils/firebase.js";
import {
  PinInput,
  PinInputGroup,
  PinInputInput,
} from "@/components/ui/pin-input";

export default {
  components: {
    Button,
    Input,
    Label,
    LoaderCircle,
    Loading,
    PinInput,
    PinInputGroup,
    PinInputInput,
  },
  data() {
    return {
      value: [],
      loading: false,
      error: false,
      message: "",
    };
  },
  computed: {
    couple() {
      return this.$store.state.createCouple;
    },
  },
  methods: {
    handleComplete() {
      this.loading = true;
      var credential = PhoneAuthProvider.credential(
        this.$route.params.code,
        this.value.join("")
      );
      signInWithCredential(auth, credential)
        .then(async (result) => {
          const doAccountExists = await accountExists({
            owner: result.user.uid,
          });
          if (!doAccountExists) {
            const data = {
              name: result.user.displayName,
              email: result.user.email,
              owner: result.user.uid,
            };
            await createAccount({ data });
            if (this.couple) createCouple();
            this.$router.push({ name: "feed" });
          } else {
            await loginAccount({ id: result.user.uid });
            if (this.couple) createCouple();
            this.$router.push({ name: "feed" });
          }
          this.loading = false;
        })
        .catch((e) => {
          console.log(e, "error");
          this.loading = false;
          this.$store.commit("addToast", {
            description: "Código inválido, solicite um código novo.",
          });
          this.error = true;
          this.loading = false;
        });
    },
  },
};
</script>
@/utils/account.js
