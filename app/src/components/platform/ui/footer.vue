<template>
  <div>
    <div class="hidden md:flex justify-between text-xs px-4 py-2">
      <span>{{ year }} &copy;NearFutureLab</span>
    </div>
    <div
      class="md:hidden flex gap-6 justify-center border-t py-2 items-center text-gray-400"
    >
      <router-link exact-active-class="text-gray-700" :to="{ name: 'feed' }">
        <Home />
      </router-link>
      <router-link
        active-class="text-gray-700"
        :to="{ name: 'memories' }"
        class="px-4 flex"
      >
        <Image />
      </router-link>
      <router-link
        active-class="text-gray-700"
        :to="{ name: 'scoreboard' }"
        class="px-4 flex"
      >
        <Gamepad />
      </router-link>
      <router-link
        active-class="text-gray-700"
        :to="{ name: 'goals' }"
        class="px-4 flex"
      >
        <Gem />
      </router-link>
      <div>
        <UserMenu avatarClass="scale-75" />
      </div>
    </div>
  </div>
</template>

<script>
import AccountAvatar from "@/components/ui/account-avatar.vue";
import { Gamepad, Goal, Home, Image, Gem } from "lucide-vue-next";
import UserMenu from "@/components/platform/ui/user-menu.vue";

export default {
  components: {
    Home,
    Image,
    Gamepad,
    Goal,
    Gem,
    AccountAvatar,
    UserMenu,
  },
  computed: {
    year() {
      return new Date().getFullYear();
    },
    account() {
      return this.$store.state.account;
    },
  },
};
</script>
