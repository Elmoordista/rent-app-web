import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from '../src/lib/router';  // adjust path as needed
import 'vuetify/dist/vuetify.min.css';

import Notifications from 'vue-awesome-notifications'
import 'vue-awesome-notifications/dist/styles/style.css'

import VueApexCharts from 'vue-apexcharts'

Vue.component('apexchart', VueApexCharts)

Vue.config.productionTip = false

let options = {
  labels: {
    success: 'Success!',
    warning: 'Warning!',
    alert: 'Failed!',
    confirm: 'Failed!',
  },
  position: 'top-right',
  durations: {
    global: 2000
  }
}

Vue.use(Notifications, options)

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
