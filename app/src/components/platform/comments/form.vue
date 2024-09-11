<template>
  <div class="border-t flex items-center rounded-b">
    <div
      :contenteditable="true"
      placeholder="..."
      class="min-h-6 p-2 text-sm bg-gray-50 flex-1"
      @input="setContent"
      ref="contentEditabled"
    />
    <div class="flex justify-end p-2">
      <Button @click="save" size="xs">
        <Send size="16" />
      </Button>
    </div>
  </div>
</template>
<script>
import { Button } from "@/components/ui/button";
import { createComment } from "@/utils/comment";
import { Send } from "lucide-vue-next";
export default {
  props: {
    type: {
      type: String,
    },
    id: {
      type: String,
    },
  },
  components: {
    Button,
    Send,
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
      await createComment({
        data: {
          content: this.content,
          type: this.type,
          id: this.id,
        },
      });
      this.$refs.contentEditabled.innerHTML = "";
      this.$emit("updateFeed");
    },
  },
};
</script>
./create.vue
