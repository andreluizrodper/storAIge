<template>
  <div class="border rounded shadow-md flex flex-col">
    <div
      :contenteditable="true"
      placeholder="O que você está pensando..."
      class="min-h-6 p-2 text-sm bg-gray-100"
      @input="setContent"
      ref="contentEditabled"
    />
    <div class="flex justify-end p-2">
      <Button @click="save" size="xs">Postar</Button>
    </div>
  </div>
</template>
<script>
import { Button } from "@/components/ui/button";
import { createFeed } from "@/utils/feed";
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
      await createFeed({
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
