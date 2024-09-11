<template>
  <p class="text-sm font-semibold">
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
