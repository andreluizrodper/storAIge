<template>
  <div class="w-full flex flex-col gap-4">
    <div class="flex justify-between items-center">
      <p class="text-sm">Our scoreboard</p>
      <CreateScore
        v-if="otherHalfAccount"
        @updateFeed="updateFeed"
        :otherHalfAccount="otherHalfAccount"
      />
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
import CreateScore from "@/components/platform/scoreboard/create.vue";
import Item from "@/components/platform/scoreboard/item.vue";
import { getScore } from "@/utils/score";
import Loading from "@/components/ui/loading.vue";

export default {
  components: {
    CreateScore,
    Item,
    Loading,
  },
  data() {
    return {
      items: null,
      loading: true,
    };
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
    otherHalfAccount() {
      return this.$store.state.otherHalfAccount;
    },
  },
  async mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      const items = await getScore();
      this.items = items;
      this.loading = false;
    },
    updateFeed() {
      this.getData();
    },
  },
};
</script>
