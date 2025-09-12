<template>
  <v-app id="inspire">
    <!-- Drawer -->
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

          <v-list-item-content style="color: white; padding: 0;">
            <v-list-item-title>
              {{ link.text }}
              <!-- Booking notification -->
              <v-tooltip
                v-if="link.text === 'Bookings' && booking_pending > 0"
                right
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-avatar
                    v-bind="attrs"
                    v-on="on"
                    size="20"
                    class="ml-2"
                    color="red"
                  >
                    <span style="color: white; font-size: 12px;">
                      {{ booking_pending }}
                    </span>
                  </v-avatar>
                </template>
                <span>You have {{ booking_pending }} pending bookings</span>
              </v-tooltip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar v-if="!isLoginPage" app color="grey darken-4 app-bar-wrapper">
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        style="color: white;"
      ></v-app-bar-nav-icon>
      <v-toolbar-title style="color: white;">{{ $route.name }}</v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- Profile Menu -->
      <div class="text-center">
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          transition="slide-x-transition"
          bottom
          :nudge-width="100"
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-avatar v-bind="attrs" v-on="on" size="32" class="ml-2">
              <v-icon color="#fff" size="40">mdi-account-circle</v-icon>
            </v-avatar>
          </template>

          <v-card
            class="menu-wrapper"
            style="background-color: #424242; color: white; min-width: 200px;"
          >
            <v-list>
              <v-list-item @click="gcashDialog = true">
                <v-list-item-title>
                  <v-icon left>mdi-cog</v-icon>
                  Settings
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list>
              <v-list-item @click="handleLogout">
                <v-list-item-title>
                  <v-icon left>mdi-logout</v-icon>
                  Logout
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="main-wrapper">
      <router-view></router-view>
    </v-main>

    <!-- 📱 GCash Account Modal -->
    <v-dialog v-model="gcashDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="headline grey darken-4 white--text">
          <v-icon left color="cyan">mdi-credit-card</v-icon>
          Add GCash Account
        </v-card-title>
        <v-card-text class="pt-4">
          <v-text-field
            v-model="gcashName"
            label="GCash Account Name"
            outlined
            dense
            prepend-inner-icon="mdi-account"
          ></v-text-field>
          <v-text-field
            v-model="gcashNumber"
            label="GCash Mobile Number"
            outlined
            dense
            prepend-inner-icon="mdi-phone"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="red" @click="gcashDialog = false">Cancel</v-btn>
          <v-btn color="cyan darken-1" dark @click="saveGCash">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    cards: ['Today', 'Yesterday'],
    drawer: null,
    fav: true,
    menu: false,
    message: false,
    hints: true,
    booking_pending: 0,
    gcashDialog: false, // 👈 modal state
    gcashName: '',
    gcashNumber: '',
    links: [
      { icon: 'mdi-view-dashboard', text: 'Dashboard', link: '/dashboard' },
      { icon: 'mdi-account', text: 'User', link: '/user' },
      { icon: 'mdi-view-grid', text: 'Category', link: '/category' },
      { icon: 'mdi-view-list', text: 'Items', link: '/items' },
      { icon: 'mdi-order-bool-descending-variant', text: 'Bookings', link: '/bookings' },
    ],
  }),

  computed: {
    isLoginPage() {
      return this.$route.name === 'Login';
    }
  },

  mounted() {
    if(localStorage.getItem('token')) {
      this.handleGetNotifications();
      this.getGcashAccount();
    }
  },

  methods: {
    handleGetNotifications() {
      this.$notiflix.Loading.arrows();
      this.submitLoading = true;
      this.axios.get(`/booking/get-pendings`)
        .then(res => {
          if (res.status) this.booking_pending = res.data.data;
        })
        .catch(err => console.log(err))
        .finally(() => {
          this.submitLoading = false;
          this.$notiflix.Loading.remove();
        });
    },
    handleLogout() {
      this.$notiflix.Confirm.show(
        'Logout',
        'Do you want to logout?',
        'Yes',
        'No',
        () => {
          localStorage.removeItem('token');
          this.$router.push({ name: 'Login' });
        }
      );
    },
    getGcashAccount() {
      this.axios.get(`/payment-accounts`)
        .then(res => {
          console.log(res.data.data,'res.data.data')
          if (res.data.success && res.data.data) {
            this.gcashName = res.data.data.account_name;
            this.gcashNumber = res.data.data.account_number;
          }
        })
        .catch(err => console.log(err));
    },
    saveGCash() {
      if (!this.gcashName || !this.gcashNumber) {
        this.$notiflix.Notify.failure('Please complete all fields');
        return;
      }
      // 👇 Call API or save in DB
       this.axios.post(`/payment-accounts`, {
        account_name: this.gcashName,
        account_number: this.gcashNumber,
        type: 'gcash'
      })
        .then(res => {
          if (res.status) this.booking_pending = res.data.data;
        })
        .catch(err => console.log(err))
        .finally(() => {
          this.submitLoading = false;
          this.$notiflix.Loading.remove();
        });
      this.$awn.success('GCash account saved!');
      this.gcashDialog = false;
    }
  }
};
</script>

<style>
.app-bar-wrapper .v-toolbar__content {
  border-left: 1px solid #4d4d4d !important;
}
.main-wrapper {
  background-color: #ededed;
}
.menu-wrapper .v-list:hover {
  background-color: #616161 !important;
}
.menu-wrapper .v-list:hover * {
  color: #fff;
}
</style>
