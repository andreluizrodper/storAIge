<template>
  <CreateCouple v-if="!account.inCouple" />
  <div v-if="account.inCouple" class="flex flex-1 w-full">
    <div class="mx-auto w-full gap-4 max-w-4xl my-3 md:px-3 flex flex-col">
      <div class="flex gap-4 items-center px-3 md:px-0 justify-between">
        <p class="text-xl">CouplingBetter</p>
        <MoodBar />
      </div>
      <div class="flex gap-4 flex-1 px-3 md:px-0">
        <Sidebar />
        <RouterView />
      </div>
      <Footer />
    </div>
  </div>
</template>

<script>
import CreateCouple from "@/components/platform/create-couple.vue";
import Feed from "@/components/platform/feed.vue";
import { RouterView } from "vue-router";
import Sidebar from "@/components/platform/ui/sidebar.vue";
import Footer from "@/components/platform/ui/footer.vue";
import MoodBar from "@/components/platform/mood-bar.vue";

export default {
  components: {
    CreateCouple,
    Feed,
    RouterView,
    Sidebar,
    Footer,
    MoodBar,
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
  },
};
</script>
