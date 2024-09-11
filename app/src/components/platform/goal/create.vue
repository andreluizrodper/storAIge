<template>
  <div class="border rounded shadow-md flex flex-col">
    <div
      :contenteditable="true"
      placeholder="Qual a meta que você quer compartilhar?"
      class="min-h-6 p-2 text-sm bg-gray-100"
      @input="setContent"
      ref="contentEditabled"
    />
    <div class="flex justify-end p-2">
      <Button @click="save" size="xs">Compartilhar</Button>
    </div>
  </div>
</template>
<script>
import { Button } from "@/components/ui/button";
import { createGoal } from "@/utils/goals";
export default {
  components: {
    Button,
  },
  data() {
    return {
      content: null,
    };
  },
  emits: ["updateFeed"],
  methods: {
    setContent(val) {
      this.content = val.target.innerHTML;
    },
    async save() {
      if (!this.content) return;
      await createGoal({
        data: {
          content: this.content,
        },
      });
      this.$refs.contentEditabled.innerHTML = "";
      this.$emit("updateFeed");
    },
  },
};
</script>
./create.vue
