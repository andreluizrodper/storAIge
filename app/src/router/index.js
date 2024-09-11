import { createWebHistory, createRouter } from "vue-router";

import Home from "@/views/home.vue";
import auth from "@/views/auth";
import platform from "@/views/platform";

const routes = [
  { path: "", name: "Home", component: Home },
  ...auth,
  ...platform,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
