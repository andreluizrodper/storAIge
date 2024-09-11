<template>
  <div class="border rounded shadow-sm flex flex-col gap-2">
    <div class="p-2 md:p-4 md:pb-2">
      <div class="flex gap-2">
        <img :src="item.created_by.avatar" class="size-12 rounded-full" />
        <div class="flex flex-col justify-center">
          <p class="text-xl">{{ item.created_by.name }}</p>
          <span class="text-xs">{{ createdAt }}</span>
        </div>
      </div>
      <div v-if="item.title.length > 0" class="text-xl py-2">
        {{ item.title }}
      </div>
      <div @click="open = true" class="flex gap-4">
        <div v-for="item in photos" :key="item.uuid" class="">
          <img :src="item.url" class="h-20 rounded border" />
        </div>
        <div
          v-if="item.photos.length > photos.length"
          class="flex items-center justify-center bg-gray-50 px-4 text-sm text-center flex flex-col rounded border"
        >
          + {{ item.photos.length - photos.length }}
          <span class="text-xs">imagens</span>
        </div>
      </div>
      <div class="flex gap-4 justify-between mt-2">
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
        <button
          v-if="item.created_by.id === account.id"
          @click="archiveGallery"
        >
          <Trash size="14" />
        </button>
      </div>
    </div>
    <Comments :limit="2" type="goal" :id="item.id" />
  </div>
  <Dialog v-if="open" :open="!!open" @update:open="toggleOpen">
    <DialogContent class="grid-rows-[auto_minmax(0,1fr)_auto] max-h-[90dvh]">
      <DialogHeader>
        <div class="flex justify-between">
          <DialogTitle>{{ item.title }}</DialogTitle>
          <button @click="open = false">
            <X />
          </button>
        </div>
      </DialogHeader>
      <div class="grid grid-cols-1 gap-2 overflow-x-auto">
        <div v-for="photo in item.photos" :key="photo.uuid">
          <img :src="photo.url" class="" />
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script>
import { Trash, X } from "lucide-vue-next";
import { DateTime } from "luxon";
import { updateGallery } from "@/utils/gallery";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogScrollContent,
} from "@/components/ui/dialog";
import Comments from "@/components/platform/comments/wrapper.vue";

export default {
  components: {
    Trash,
    X,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogScrollContent,
    Comments,
  },
  props: {
    item: {
      type: Object,
    },
  },
  data() {
    return {
      open: false,
      reactions: ["😍", "😂", "😱"],
    };
  },
  computed: {
    photos() {
      return this.item.photos.slice(0, 4);
    },
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
    toggleOpen() {
      this.open = false;
    },
    archiveGallery() {
      this.$store.commit("setDialog", {
        title: "Deseja arquivar esse post?",
        action: this.doArchiveGallery,
      });
    },
    async doArchiveGallery() {
      await updateGallery({ id: this.item.id, data: { archived: true } });
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
      await updateGallery({ id: this.item.id, data: { reactions } });
    },
  },
};
</script>
