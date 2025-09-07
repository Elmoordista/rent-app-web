import Vue from 'vue';
import Router from 'vue-router';

import Dashboard from '../pages/Dashboard.vue';
import User from '../pages/User.vue';
import Category from '../pages/Category.vue';
import Items from '../pages/Items.vue';
import Bookings from '../pages/Bookings.vue';
import Login from '../pages/Login.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', name: 'Login', component: Login },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/user', name: 'User', component: User, meta: { requiresAuth: true } },
    { path: '/category', name: 'Category', component: Category, meta: { requiresAuth: true } },
    { path: '/items', name: 'Items', component: Items, meta: { requiresAuth: true } },
    { path: '/bookings', name: 'Bookings', component: Bookings, meta: { requiresAuth: true } },
  ],
});

// 🔑 Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); // or check Vuex state

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login'); // redirect to login if not authenticated
  } else {
    next(); // proceed
  }
});

export default router;
