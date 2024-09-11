<template>
  <div class="flex flex-1 items-center justify-center mx-4">
    <Card class="text-center">
      <CardHeader>
        <CardTitle> Agora vamos convidar a sua outra metade </CardTitle>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <p class="text-base">
          Assim que a conta for ativada com o link abaixo, você terá acesso
          completo a plataforma!
        </p>
        <div
          @click="copyToClipboard"
          class="bg-gray-50 cursor-pointer text-gray-600 max-w-[100%] break-all rounded-sm px-1 text-pretty py-1 text-ellipsis"
        >
          {{ link }}
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script>
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default {
  components: {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
    link() {
      return `https://couplingbetter.com/auth/i/${this.account.id}`;
    },
  },
  methods: {
    copyToClipboard() {
      if (!navigator || !navigator.clipboard) return;
      navigator.clipboard?.writeText(this.link);
      this.$store.commit("addToast", {
        description: "Link copiado! Só compartilhar agora.",
      });
    },
  },
};
</script>
