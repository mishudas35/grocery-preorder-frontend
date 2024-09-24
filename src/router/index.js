import { createRouter, createWebHistory } from 'vue-router';
import PreOrderForm from '@/components/PreOrderForm.vue';
import PreOrderList from '@/components/PreOrderList.vue';
import LoginUser from '@/components/LoginUser.vue';

const routes = [
  {
    path: '/',
    redirect: '/preorder-list'
  },
  {
    path: '/preorder',
    name: 'PreOrderForm',
    component: PreOrderForm
  },
  {
    path: '/preorder-list',
    name: 'PreOrderList',
    component: PreOrderList
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginUser,
  },
];

const router = createRouter({
  history: createWebHistory(), // Use WebHistory mode
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next({ path: '/login' });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (role !== 'admin') {
      next({ path: '/preorder-list' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
