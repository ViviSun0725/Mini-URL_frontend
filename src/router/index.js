import { createRouter, createWebHistory } from 'vue-router';
import ShortenerForm from '@/components/ShortenerForm.vue';
import RedirectPage from '@/components/RedirectPage.vue';
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';
import MyUrls from '@/components/MyUrls.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'ShortenerForm',
      component: ShortenerForm,
    },
    {
      path: '/:shortCode',
      component: RedirectPage,
    },
    {
      path: '/protected-link/:shortCode',
      component: RedirectPage,
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/register',
      component: Register,
    },
    {
      path: '/my-urls',
      component: MyUrls,
    }
  ],
})

export default router
