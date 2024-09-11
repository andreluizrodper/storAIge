<template>
  <div class="hidden md:flex flex-col gap-4">
    <UserMenu />
    <router-link
      :to="{ name: 'feed' }"
      exact-active-class="bg-gray-100"
      class="flex p-2 hover:bg-gray-100 rounded"
    >
      <Home />
    </router-link>
    <router-link
      :to="{ name: 'memories' }"
      active-class="bg-gray-100"
      class="flex p-2 hover:bg-gray-100 rounded"
    >
      <Image />
    </router-link>
    <router-link
      :to="{ name: 'scoreboard' }"
      active-class="bg-gray-100"
      class="flex p-2 hover:bg-gray-100 rounded"
    >
      <Gamepad />
    </router-link>
    <router-link
      :to="{ name: 'goals' }"
      active-class="bg-gray-100"
      class="flex p-2 hover:bg-gray-100 rounded"
    >
      <Gem />
    </router-link>
  </div>
</template>

<script>
import AccountAvatar from "@/components/ui/account-avatar.vue";
import { Gem, Gamepad, Goal, Home, Image } from "lucide-vue-next";
import UserMenu from "@/components/platform/ui/user-menu.vue";

export default {
  components: {
    UserMenu,
    AccountAvatar,
    Gamepad,
    Goal,
    Home,
    Image,
    Gem,
  },
};
</script>
