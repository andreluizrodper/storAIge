<template>
  <div
    v-if="toasts.length > 0"
    class="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] gap-2"
  >
    <Toast v-for="(toast, index) in toasts" :key="index">
      <div class="grid gap-1">
        <ToastTitle v-if="toast.title">
          {{ toast.title }}
        </ToastTitle>
        <template v-if="toast.description">
          <ToastDescription>
            {{ toast.description }}
          </ToastDescription>
        </template>
        <ToastClose :index="index" />
      </div>
    </Toast>
  </div>
</template>

<script>
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export default {
  components: {
    Toast,
    ToastClose,
    ToastDescription,
    ToastTitle,
    ToastViewport,
  },
  computed: {
    toasts() {
      return this.$store.state.toasts;
    },
  },
};
</script>
