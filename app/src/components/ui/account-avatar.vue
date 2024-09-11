<template>
  <div v-if="accountData" :class="`flex justify-between gap-2 ${className}`">
    <div class="flex items-center gap-2 justify-start">
      <Avatar class="flex items-center justify-center">
        <img
          v-if="accountData.avatar"
          :src="accountData.avatar"
          class="size-12 object-cover object-center"
        />
        <AvatarFallback v-if="!accountData.avatar">
          <LoaderCircle v-if="!accountData" class="size-4 animate-spin" />
          {{ initials }}
        </AvatarFallback>
      </Avatar>
      <div
        v-if="showName && accountData"
        class="flex flex-col justify-center items-start"
      >
        {{ accountData.name }}
        <span class="text-xs">{{ accountData.email }}</span>
      </div>
    </div>
    <slot :account="accountData" />
  </div>
</template>

<script>
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LoaderCircle } from "lucide-vue-next";
import { getAccount } from "@/utils/account";

export default {
  props: {
    id: {
      type: String,
    },
    showName: {
      type: Boolean,
      default: false,
    },
    className: {
      type: String,
      required: false,
    },
  },
  components: {
    Avatar,
    AvatarFallback,
    LoaderCircle,
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
    initials() {
      if (!this.account) return "";
      if (!this.account.name) return "A";
      const parts = this.account.name.split(" ");
      if (parts.length === 1) return parts[0].charAt(0);

      return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
    },
  },
  mounted() {
    if (this.account.id !== this.id) this.getData();
    else this.accountData = this.account;
  },
  data() {
    return {
      accountData: null,
    };
  },
  methods: {
    async getData() {
      this.accountData = await getAccount({ id: this.id, setStore: false });
    },
  },
};
</script>
