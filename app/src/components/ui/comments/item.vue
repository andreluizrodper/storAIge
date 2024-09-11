<template>
  <div>
    <div class="flex justify-between items-center">
      <div class="flex gap-2 py-2">
        <AccountAvatar v-if="creator" :id="creator.id" />
        <div class="flex flex-col">
          {{ creator && creator.data().name }}
          <span class="text-xs">{{ createdAtFormated }}</span>
        </div>
      </div>
      <div v-if="account && account.id === comment.data().created_by">
        <Button @click="doArchiveComment" variant="outline" size="sm">
          <Trash size="16" />
        </Button>
      </div>
    </div>
    <div class="break-all" v-html="content"></div>
  </div>
</template>

<script>
import AccountAvatar from "@/components/ui/account-avatar.vue";
import { getAccount } from "@/utils/account";
import { DateTime } from "luxon";
import { Trash } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { archiveComment } from "@/utils/comments";

export default {
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  components: {
    AccountAvatar,
    Button,
    Trash,
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
    content() {
      const content = this.comment.data().comment.split(" ");
      for (let i = 0; i < content.length; i++) {
        if (content[i].startsWith("http")) {
          content[
            i
          ] = `<a href="${content[i]}" class="underline" target="_blank">${content[i]}</a>`;
        }
      }
      return content.join(" ");
    },
    createdAtFormated() {
      return DateTime.fromJSDate(
        this.comment.data().created_at.toDate()
      ).toRelative();
    },
  },
  data() {
    return {
      creator: null,
    };
  },
  async mounted() {
    this.creator = await getAccount({
      id: this.comment.data().created_by,
      setStore: false,
    });
  },
  methods: {
    doArchiveComment() {
      archiveComment({ id: this.comment.id }).then(() => {
        this.$emit("update");
      });
    },
  },
};
</script>
