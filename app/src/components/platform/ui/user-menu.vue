<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <AccountAvatar v-if="account" :id="account.id" :class="avatarClass" />
    </DropdownMenuTrigger>
    <DropdownMenuContent v-if="account" align="start">
      <DropdownMenuLabel>{{ greeting }}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem> Minha conta </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <ToggleTheme />
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="logOut">
        <LogOut size="16" class="mr-2" />
        Sair
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script>
import { Check, LoaderCircle } from "lucide-vue-next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-vue-next";
import { signOut } from "firebase/auth";
import { auth } from "@/utils/firebase.js";
import AccountAvatar from "@/components/ui/account-avatar.vue";
import ToggleTheme from "@/components/platform/ui/toggle-theme.vue";

export default {
  props: {
    avatarClass: {
      type: String,
    },
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
    greeting() {
      if (this.account.name.length === 0) return "Oi! Tudo bem?";
      return this.account.name;
    },
    restaurants() {
      return this.$store.state.restaurants;
    },
    restaurant() {
      return this.$store.state.restaurant;
    },
  },
  components: {
    Check,
    AccountAvatar,
    LoaderCircle,
    LogOut,
    ToggleTheme,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    Avatar,
    AvatarFallback,
  },
  methods: {
    logOut() {
      signOut(auth).then(() => {
        this.$store.commit("setAccount", null);
        this.$router.push({ name: "login" });
      });
    },
  },
};
</script>
