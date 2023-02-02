import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";

const router = createRouter({
  history: createWebHashHistory(), // 采用hash模式路由
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../pages/home/index.vue"),
    },
    {
      path: "/books",
      name: "books",
      component: () => import("../pages/books/index.vue"),
    },
    {
      path: "/book",
      name: "book",
      component: () => import("../pages/book/index.vue"),
    },
  ],
});

export default router;
