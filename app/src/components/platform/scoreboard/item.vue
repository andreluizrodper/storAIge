<template>
  <div class="border rounded shadow-sm p-2 md:p-4 flex flex-col gap-2">
    <div class="flex gap-2">
      <img :src="item.created_by.avatar" class="size-12 rounded-full" />
      <div class="flex flex-col justify-center">
        <p class="text-xl">{{ item.created_by.name }}</p>
        <span class="text-xs">{{ createdAt }}</span>
      </div>
    </div>
    <div class="text-xl">{{ item.game }}</div>
    <div @click="open = true" class="flex gap-4 justify-evenly">
      <div
        class="flex flex-col gap-4"
        v-for="(item, index) in accounts"
        :key="index"
      >
        <div class="flex items-center gap-2">
          <img :src="item.account.avatar" class="size-12 rounded-full" />
          {{ item.account.name }}
        </div>
        <p class="text-center text-2xl">{{ item.points }}</p>
      </div>
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
      <button v-if="item.created_by.id === account.id" @click="archiveScore">
        <Trash size="14" />
      </button>
    </div>
  </div>
  <Dialog v-if="open" :open="!!open" @update:open="toggleOpen">
    <DialogContent class="grid-rows-[auto_minmax(0,1fr)_auto] max-h-[90dvh]">
      <DialogHeader>
        <div class="flex justify-between">
          <DialogTitle>{{ item.game }}</DialogTitle>
          <button @click="open = false">
            <X />
          </button>
        </div>
      </DialogHeader>

      <div class="grid grid-cols-1 gap-2 overflow-x-auto">
        <div
          class="flex flex-col gap-4 w-full"
          v-for="(history, index) in points"
          :key="index"
        >
          <div class="flex items-start gap-4">
            <div class="grid grid-cols-2 flex-1 gap-4">
              <div
                class="flex flex-col gap-2"
                v-for="(item, index) in history"
                :key="index"
              >
                <div class="flex items-center gap-4">
                  <img
                    :src="item.account.avatar"
                    class="size-12 rounded-full"
                  />
                  <span>{{ item.account.name }}</span>
                </div>
                <Input v-model="item.points" placeholder="Pontuação" />
              </div>
            </div>
            <button class="border rounded p-2 hover:bg-gray-50">
              <X size="14" @click="removePoint(index)" />
            </button>
          </div>
        </div>
        <div>
          <Button @click="addRound">Add round</Button>
        </div>
      </div>
      <div class="flex justify-between">
        <Button variant="outline" @click="open = false">Cancel</Button>
        <Button @click="save">
          <div class="flex items-center gap-2">Save</div>
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script>
import { Trash, X } from "lucide-vue-next";
import { DateTime } from "luxon";
import { updateScore } from "@/utils/score";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default {
  components: {
    Trash,
    Button,
    Input,
    X,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogScrollContent,
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
      accounts: [],
      points: [],
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
  mounted() {
    this.getPoints();
  },
  methods: {
    getPoints() {
      const history = JSON.parse(this.item.points);
      let point_account_1 = 0;
      let point_account_2 = 0;
      history.forEach((point) => {
        point_account_1 += parseFloat(point[0].points);
        point_account_2 += parseFloat(point[1].points);
      });
      this.accounts = [
        { account: history[0][0].account, points: point_account_2 },
        { account: history[0][1].account, points: point_account_1 },
      ];
      this.points = history;
    },
    toggleOpen() {
      this.open = false;
    },
    removePoint(index) {
      this.points.splice(index, 1);
      if (this.points.length === 0) this.addRound();
    },
    addRound() {
      const points = this.points[0];
      this.points.push([
        { account: points[0].account, date: new Date() },
        { account: points[1].account, date: new Date() },
      ]);
    },
    archiveScore() {
      this.$store.commit("setDialog", {
        title: "Deseja arquivar esse post?",
        action: this.doArchiveScore,
      });
    },
    async doArchiveScore() {
      await updateScore({ id: this.item.id, data: { archived: true } });
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
      await updateScore({ id: this.item.id, data: { reactions } });
    },
    async save() {
      await updateScore({
        id: this.item.id,
        data: {
          points: JSON.stringify(this.points),
        },
      });
      this.item.points = JSON.stringify(this.points);
      this.getPoints();
      this.open = false;
    },
  },
};
</script>
