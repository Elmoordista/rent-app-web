import Vue from 'vue';
import Router from 'vue-router';

// Import your page components
import Dashboard from '../pages/Dashboard.vue';
import User from '../pages/User.vue';
import Category from '../pages/Category.vue';
import Items from '../pages/Items.vue';
import Bookings from '../pages/Bookings.vue';
import Login from '../pages/Login.vue';

Vue.use(Router);

export default new Router({
  mode: 'history', // pretty URLs without #
  routes: [
    {
      path: '/',
      redirect: '/dashboard', // default route
    },

    {
      path: '/login',
      name: 'Login',
      component: Login,
    },  
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
    },
    {
      path: '/user',
      name: 'User',
      component: User,
    },
    {
      path: '/category',
      name: 'Category',
      component: Category,
    },
    {
      path: '/items',
      name: 'Items',
      component: Items,
    },
    {
      path: '/bookings',
      name: 'Bookings',
      component: Bookings,
    },
    // add more routes as needed
  ],
});
