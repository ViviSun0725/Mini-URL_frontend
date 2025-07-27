import { createRouter, createWebHistory } from "vue-router";
import ShortenerForm from "@/views/ShortenerFormView.vue";
import RedirectPage from "@/views/RedirectPageView.vue";
import Login from "@/views/LoginView.vue";
import Register from "@/views/RegisterView.vue";
import MyUrls from "@/views/MyUrlsView.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "ShortenerForm",
      component: ShortenerForm,
    },
    {
      path: "/:shortCode",
      component: RedirectPage,
    },
    {
      path: "/protected-link/:shortCode",
      component: RedirectPage,
    },
    {
      path: "/login",
      component: Login,
      meta: { guestOnly: true },
    },
    {
      path: "/register",
      component: Register,
      meta: { guestOnly: true },
    },
    {
      path: "/my-urls",
      component: MyUrls,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isLoggedIn;

  if (to.meta.requiresAuth && !isLoggedIn) {
    next("/login");
  } else if (to.meta.guestOnly && isLoggedIn) {
    next('/');
  } else {
    next();
  }
});

export default router;
