import { createRouter, createWebHistory } from 'vue-router';
import PreOrderForm from '@/components/PreOrderForm.vue';
import PreOrderList from '@/components/PreOrderList.vue';

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
  }
];

const router = createRouter({
  history: createWebHistory(), // Use WebHistory mode
  routes
});

export default router;
