<template>
  <div class="w-full">
    <Create @updateFeed="updateFeed" />
    <div v-if="loading" class="mt-4 flex justify-center">
      <Loading />
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
import Create from "@/components/platform/goal/create.vue";
import Item from "@/components/platform/goal/item.vue";
import { getGoal } from "@/utils/goals";
import Loading from "@/components/ui/loading.vue";

export default {
  components: {
    Create,
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
      const items = await getGoal();
      this.items = items;
      this.loading = false;
    },
    updateFeed() {
      this.getData();
    },
  },
};
</script>
