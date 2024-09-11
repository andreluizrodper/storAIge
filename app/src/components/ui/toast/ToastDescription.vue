<template>
  <p class="text-sm opacity-90">
    <slot />
  </p>
</template>

<script>
export default {
  props: {
    class: {
      type: String,
      default: "",
    },
  },
};
</script>
