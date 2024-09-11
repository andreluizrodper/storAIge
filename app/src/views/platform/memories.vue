<template>
  <div class="w-full flex flex-col gap-4">
    <div class="flex justify-between items-center">
      <p class="text-sm">Our memories</p>
      <CreateMemory @updateFeed="updateFeed" />
    </div>
    <div v-if="!loading && items.empty">
      <p class="text-sm text-gray-500 text-center mt-4">
        Nada por aqui ainda =[
      </p>
    </div>
    <div v-if="!items?.empty" class="flex flex-col gap-4 mt-4">
      <Item
        v-for="item in items"
        @updateFeed="updateFeed"
        :key="item.id"
        :item="item"
      />
    </div>
  </div>
</template>

<script>
import CreateMemory from "@/components/platform/gallery/create.vue";
import Item from "@/components/platform/gallery/item.vue";
import { getGallery } from "@/utils/gallery";
import Loading from "@/components/ui/loading.vue";

export default {
  components: {
    CreateMemory,
    Item,
    Loading,
  },
  data() {
    return {
      items: null,
      loading: true,
    };
  },
  async mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      const items = await getGallery();
      this.items = items;
      this.loading = false;
    },
    updateFeed() {
      this.getData();
    },
  },
};
</script>
