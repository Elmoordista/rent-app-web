<template>
  <v-app id="inspire">
    <!-- Conditionally Render Navigation Drawer and App Bar only if not on the Login page -->
    <v-navigation-drawer
      v-if="!isLoginPage"
      v-model="drawer"
      color="grey darken-4"
      app
    >
      <v-sheet
        color="grey darken-4"
        class="pa-4 d-flex flex-column align-center"
      >
        <div>
          <h2 style="color: white;">Rent App</h2>
        </div>
      </v-sheet>

      <v-divider style="background-color: #4d4d4d;"></v-divider>

      <v-list style="color: white;">
        <v-list-item
          v-for="link in links"
          :key="link.icon"
          link
          :to="link.link"
        >
          <v-list-item-icon>
            <v-icon style="color: white;">{{ link.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content style="color: white;">
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar v-if="!isLoginPage" app color="grey darken-4 app-bar-wrapper">
      <v-app-bar-nav-icon @click="drawer = !drawer" style="color: white;"></v-app-bar-nav-icon>
      <v-toolbar-title style="color: white;">{{ $route.name }}</v-toolbar-title>
    </v-app-bar>

    <v-main class="main-wrapper">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    cards: ['Today', 'Yesterday'],
    drawer: null,
    links: [
      {
        icon: 'mdi-view-dashboard',
        text: 'Dashboard',
        link: '/dashboard',
      },
      {
        icon: 'mdi-account',
        text: 'User',
        link: '/user',
      },
      {
        icon: 'mdi-view-grid',
        text: 'Category',
        link: '/category',
      },
      {
        icon: 'mdi-view-list',
        text: 'Items',
        link: '/items',
      },
      {
        icon: 'mdi-order-bool-descending-variant',
        text: 'Bookings',
        link: '/bookings',
      },
    ],
  }),

  computed: {
    // Check if the current route is the login page
    isLoginPage() {
      return this.$route.name === 'Login';
    }
  },
};
</script>

<style>
.app-bar-wrapper .v-toolbar__content {
  border-left: 1px solid #4d4d4d !important;
}
</style>

<style scoped>
.v-toolbar__content {
  border-left: 1px solid #4d4d4d;
}

.main-wrapper {
  background-color: #ededed;
}
</style>
