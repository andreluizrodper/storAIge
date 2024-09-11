<template>
  <div>
    <Button variant="outline" @click="open = true">Nova pontuação</Button>
    <Dialog v-if="open" :open="!!open" @update:open="toggleOpen">
      <DialogContent class="grid-rows-[auto_minmax(0,1fr)_auto] max-h-[90dvh]">
        <DialogHeader>
          <DialogTitle>Criando uma nova pontuação</DialogTitle>
          <DialogDescription>Adicione os pontos</DialogDescription>
        </DialogHeader>
        <div class="flex gap-4 flex-col">
          <div class="flex-1">
            <Input v-model="game" placeholder="Qual o jogo" />
          </div>
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
        </div>
        <div>
          <Button @click="addRound">Add round</Button>
        </div>
        <div class="flex justify-between">
          <Button variant="outline" @click="open = false">Cancel</Button>
          <Button @click="save" :disabled="loading || !isValid">
            <div class="flex items-center gap-2">
              <Loading v-if="loading" />
              Create
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script>
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
import Loading from "@/components/ui/loading.vue";
import { Image, Trash, X } from "lucide-vue-next";
import { createScore } from "@/utils/score";

export default {
  props: {
    otherHalfAccount: {
      type: Object,
    },
  },
  components: {
    Image,
    Input,
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogScrollContent,
    Loading,
    Trash,
    X,
  },
  data() {
    return {
      game: "",
      photos: [],
      open: false,
      loading: false,
      points: [],
    };
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
    isValid() {
      return this.game.length > 0;
    },
  },
  mounted() {
    this.addRound();
  },
  methods: {
    toggleOpen() {
      this.open = false;
    },
    removePoint(index) {
      this.points.splice(index, 1);
      if (this.points.length === 0) this.addRound();
    },
    addRound() {
      this.points.push([
        { account: this.account, date: new Date() },
        { account: this.otherHalfAccount, date: new Date() },
      ]);
    },
    async save() {
      if (!this.isValid) return;
      this.loading = true;
      await createScore({
        id: this.account.id,
        data: {
          game: this.game,
          points: JSON.stringify(this.points),
        },
      });
      this.$emit("updateFeed");
      this.open = false;
      this.loading = false;
    },
  },
};
</script>
