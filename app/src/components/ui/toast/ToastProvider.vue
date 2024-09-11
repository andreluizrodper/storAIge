<script setup>
import { ToastProvider } from "radix-vue";

const props = defineProps({
  defaultOpen: { type: Boolean, default: false },
  open: { type: Boolean, default: false },
  dir: { type: String, default: "ltr" },
  modal: { type: Boolean, default: false },
});
</script>

<template>
  <ToastProvider v-bind="props">
    <slot />
  </ToastProvider>
</template>
