const routes = [
  {
    path: "/auth",
    component: () => import("@/layouts/auth.vue"),
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("@/views/auth/login.vue"),
      },
      {
        path: "pin/:code",
        name: "pin",
        component: () => import("@/views/auth/pin.vue"),
      },
      {
        path: "i/:account_id",
        name: "invite",
        component: () => import("@/views/auth/invite.vue"),
      },
    ],
  },
];

export default routes;
