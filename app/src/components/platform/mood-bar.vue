<template>
  <div class="flex items-center gap-4">
    <Popover :open="open" @update:open="toggleOpen">
      <PopoverTrigger as-child>
        <button class="border rounded px-2" @click="open = true">
          <div class="flex flex-col my-1" v-if="account.mood">
            <span class="text-xs text-left">Feeling like today:</span>
            <span class="text-2xl">{{ myMood }}</span>
          </div>
          <div v-else class="text-sm py-2">I'm feeling today...</div>
        </button>
      </PopoverTrigger>
      <PopoverContent class="flex gap-2 flex-col">
        <p class="text-sm">How are you feeling today?</p>
        <div class="grid grid-cols-3 gap-4">
          <button
            v-for="reaction in reactions"
            :key="reaction"
            class="text-xl hover:bg-gray-100 rounded"
            @click="toogleMood(reaction)"
          >
            {{ reaction }}
          </button>
        </div>
      </PopoverContent>
    </Popover>
    <div class="relative">
      <AccountAvatar :id="otherHalfAccount.id" />
      <div class="absolute -bottom-2 -right-1 text-2xl">
        {{ otherHalfAccount.mood }}
      </div>
    </div>
  </div>
</template>

<script>
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { getAccount, updateAccount } from "@/utils/account";
import AccountAvatar from "@/components/ui/account-avatar.vue";

export default {
  components: {
    Popover,
    PopoverContent,
    PopoverTrigger,
    Button,
    AccountAvatar,
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
    otherHalfAccount() {
      return this.$store.state.otherHalfAccount;
    },
    myMood() {
      if (this.account.mood) return this.account.mood;
      return "My mood";
    },
  },
  data() {
    return {
      open: false,
      reactions: ["😀", "😍", "😭", "😱", "😴", "🥴", "🤒", "🤬", "🤩"],
    };
  },
  methods: {
    async toogleMood(reaction) {
      await updateAccount({ id: this.account.id, data: { mood: reaction } });
      this.open = false;
      getAccount({ id: this.account.id });
    },
    toggleOpen() {
      this.open = false;
    },
  },
};
</script>
