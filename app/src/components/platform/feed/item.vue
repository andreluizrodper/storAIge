<template>
  <div class="border rounded shadow-sm flex flex-col">
    <div class="p-2 md:p-4 md:pb-2">
      <div class="flex gap-2">
        <img :src="item.created_by.avatar" class="size-12 rounded-full" />
        <div class="flex flex-col justify-center">
          <p class="text-xl">{{ item.created_by.name }}</p>
          <router-link
            :to="{ name: 'feed-single', params: { feed_id: item.id } }"
          >
            <span class="underline text-xs">{{ createdAt }}</span>
          </router-link>
        </div>
      </div>
      <div class="py-2">
        {{ item.content }}
      </div>
      <div class="flex gap-4 justify-between">
        <div class="flex gap-4">
          <button
            v-for="reaction in reactions"
            :key="reaction"
            @click="toggleReaction(reaction)"
            class="opacity-50 text-xl hover:opacity-80"
            :class="postReactions.includes(reaction) ? 'opacity-100' : ''"
          >
            {{ reaction }}
          </button>
        </div>
        <button v-if="item.created_by.id === account.id" @click="archivePost">
          <Trash size="14" />
        </button>
      </div>
    </div>
    <Comments :limit="1000" type="feed" :id="item.id" />
  </div>
</template>

<script>
import { Trash } from "lucide-vue-next";
import { DateTime } from "luxon";
import { updateFeed } from "@/utils/feed";
import Comments from "@/components/platform/comments/wrapper.vue";

export default {
  components: { Trash, Comments },
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
      await updateFeed({ id: this.item.id, data: { archived: true } });
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
      await updateFeed({ id: this.item.id, data: { reactions } });
    },
  },
};
</script>
