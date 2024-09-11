<template>
  <div class="w-full">
    <div class="flex items-center">
      <router-link :to="{ name: 'goals' }">
        <ChevronLeft size="18" />
      </router-link>
    </div>
    <div v-if="item" class="flex flex-col gap-4 mt-4">
      <Item :item="item" />
    </div>
  </div>
</template>

<script>
import Create from "@/components/platform/goal/create.vue";
import Item from "@/components/platform/goal/item.vue";
import { getGoalSingle } from "@/utils/goals";
import Loading from "@/components/ui/loading.vue";
import { ChevronLeft } from "lucide-vue-next";

export default {
  components: {
    Create,
    Item,
    Loading,
    ChevronLeft,
  },
  data() {
    return {
      item: null,
      loading: true,
    };
  },
  async mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      this.item = await getGoalSingle({ id: this.$route.params.goal_id });
      this.loading = false;
    },
    updateFeed() {
      this.getData();
    },
  },
};
</script>
