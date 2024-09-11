<template>
  <div class="py-2 px-2 flex gap-2 w-full">
    <div class="flex-1">
      <div class="flex gap-2 font-bold" v-if="item.created_by">
        <div class="flex flex-col justify-center">
          <p class="text-sm">{{ item.created_by.name }}</p>
        </div>
      </div>
      {{ item.content }}
    </div>
    <div class="flex gap-4 justify-between">
      <button v-if="item.created_by.id === account.id" @click="archivePost">
        <Trash size="14" />
      </button>
    </div>
  </div>
</template>

<script>
import { Trash } from "lucide-vue-next";
import { DateTime } from "luxon";
import { updateComment } from "@/utils/comment";

export default {
  components: { Trash },
  props: {
    item: {
      type: Object,
    },
  },
  data() {
    return {
      reactions: ["😍", "😂", "😱"],
    };
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
    createdAt() {
      return DateTime.fromISO(this.item.created_at).toRelative();
    },
    postReactions() {
      if (!this.item.reactions || !this.item.reactions[this.account.id])
        return [];

      return this.item.reactions[this.account.id] ?? [];
    },
  },
  emits: ["updateFeed"],
  methods: {
    archivePost() {
      this.$store.commit("setDialog", {
        title: "Deseja arquivar esse post?",
        action: this.doArchivePost,
      });
    },
    async doArchivePost() {
      await updateComment({ id: this.item.id, data: { archived: true } });
      this.$emit("updateFeed");
    },
    async toggleReaction(reaction) {
      const reactions = this.item.reactions ?? {};
      if (reactions[this.account.id]) {
        const index = reactions[this.account.id]?.indexOf(reaction);
        if (index >= 0) reactions[this.account.id].splice(index, 1);
        else reactions[this.account.id].push(reaction);
      } else {
        reactions[this.account.id] = [];
        reactions[this.account.id].push(reaction);
      }
      this.item.reactions = reactions;
      await updateComment({ id: this.item.id, data: { reactions } });
    },
  },
};
</script>
