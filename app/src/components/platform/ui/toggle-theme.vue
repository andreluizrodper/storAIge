<template>
  <div class="flex gap-2 items-center" @click="toggleTheme">
    <Sun v-if="theme === 'light'" size="14" />
    <Moon v-if="theme === 'dark'" size="14" />
    <span>Trocar tema</span>
  </div>
</template>

<script>
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-vue-next";

export default {
  components: {
    Button,
    Moon,
    Sun,
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
  },
  methods: {
    toggleTheme() {
      this.$store.commit("setTheme", this.theme === "light" ? "dark" : "light");
    },
  },
};
</script>
