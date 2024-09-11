<template>
  <div class="bg-gray-50">
    <div v-if="items" class="flex flex-col divide-y">
      <Item v-for="item in items" :key="item.id" :item="item" />
    </div>
    <div
      v-if="items && count > items.length"
      class="text-sm text-gray-600 my-2"
    >
      Ver todos
    </div>
    <Form @updateFeed="updateFeed" :type="type" :id="id" />
  </div>
</template>

<script>
import Item from "@/components/platform/comments/item.vue";
import Form from "@/components/platform/comments/form.vue";
import { countComment, getComment } from "@/utils/comment";

export default {
  components: {
    Form,
    Item,
  },
  props: {
    type: {
      type: String,
    },
    id: {
      type: String,
    },
    limit: {
      type: Number,
    },
  },
  data() {
    return {
      items: null,
      count: null,
    };
  },
  async mounted() {
    this.updateFeed();
  },
  methods: {
    async updateFeed() {
      const items = await getComment({
        where: [
          { field: "type", operator: "==", value: this.type },
          { field: "id", operator: "==", value: this.id },
        ],
        limit: this.limit,
      });
      if (!items.empty) this.items = items;
      this.count = await countComment({
        where: [
          { field: "type", operator: "==", value: this.type },
          { field: "id", operator: "==", value: this.id },
        ],
      });
    },
  },
};
</script>
