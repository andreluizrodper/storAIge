<template>
  <div
    class="relative h-[100vh] flex-col md:items-center md:justify-center flex md:flex-row lg:px-0"
  >
    <div
      class="relative h-full flex-col bg-green-500 p-10 text-white dark:border-r flex max-h-[300px] md:max-h-full w-full"
    />
    <div class="p-8 sm:min-w-[520px]">
      <div
        class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[304px]"
      >
        <div class="flex justify-center relative z-20">
          <Logo />
        </div>
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import Logo from "@/components/ui/logo.vue";
</script>
