<template>
  <div class="w-full">
    <div class="flex items-center">
      <router-link :to="{ name: 'feed' }">
        <ChevronLeft size="18" />
      </router-link>
    </div>
    <div v-if="loading" class="mt-4 flex justify-center">
      <Loading />
    </div>
    <div v-if="item" class="flex flex-col gap-4 mt-4">
      <Item :item="item" />
    </div>
  </div>
</template>

<script>
import Create from "@/components/platform/feed/create.vue";
import Item from "@/components/platform/feed/item.vue";
import { getFeedSingle } from "@/utils/feed";
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
      this.item = await getFeedSingle({ id: this.$route.params.feed_id });
      this.loading = false;
    },
    updateFeed() {
      this.getData();
    },
  },
};
</script>
