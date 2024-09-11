const routes = [
  {
    path: "/p",
    component: () => import("@/layouts/platform.vue"),
    children: [
      {
        path: "",
        component: () => import("@/views/platform/platform.vue"),
        children: [
          {
            path: "",
            name: "feed",
            component: () => import("@/views/platform/feed.vue"),
          },
          {
            path: ":feed_id",
            name: "feed-single",
            component: () => import("@/views/platform/feed-single.vue"),
          },
          {
            path: "memories",
            name: "memories",
            component: () => import("@/views/platform/memories.vue"),
          },
          {
            path: "scoreboard",
            name: "scoreboard",
            component: () => import("@/views/platform/scoreboard.vue"),
          },
          {
            path: "goals",
            name: "goals",
            component: () => import("@/views/platform/goals.vue"),
          },
          {
            path: "goals/:goal_id",
            name: "goal_single",
            component: () => import("@/views/platform/goal-single.vue"),
          },
        ],
      },
    ],
  },
];

export default routes;
