<template>
  <div>
    <div v-if="comments.length > 0" class="py-2 text-sm">
      <p>Comentários ({{ comments.length }})</p>
    </div>
    <div class="space-y-2 max-h-[320px] overflow-y-auto">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        @update="getData"
      />
    </div>
    <form @submit.prevent="doComment" class="flex gap-2 items-center mt-4">
      <AccountAvatar :id="account?.id" />
      <Input v-model="comment" type="text" placeholder="Comentar..." />
      <Button>
        <Send size="16" />
      </Button>
    </form>
  </div>
</template>

<script>
import AccountAvatar from "@/components/ui/account-avatar.vue";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-vue-next";
import { getComments, sendComment } from "@/utils/comments";
import CommentItem from "@/components/ui/comments/item.vue";

export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
  },
  components: {
    AccountAvatar,
    Input,
    Button,
    CommentItem,
    Send,
  },
  data() {
    return {
      comments: [],
      comment: "",
    };
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
  },
  async mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.comments = await getComments({ source: this.source });
    },
    doComment() {
      if (this.comment.length > 0) {
        sendComment({
          project: this.project,
          data: {
            source: this.source,
            comment: this.comment,
          },
        }).then(() => {
          this.getData();
          this.comment = "";
        });
      }
    },
  },
};
</script>
