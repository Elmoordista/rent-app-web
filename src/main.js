import Vue from 'vue'
import App from './App.vue'
import axios from './utils/axios'
import VueAxios from 'vue-axios'
import vuetify from './plugins/vuetify'
import router from '../src/lib/router';  // adjust path as needed
import 'vuetify/dist/vuetify.min.css';
import Notiflix from 'notiflix';

import Notifications from 'vue-awesome-notifications'
import 'vue-awesome-notifications/dist/styles/style.css'

import VueApexCharts from 'vue-apexcharts'

// Notiflix.Loading.init({
//     className: 'notiflix-loading',
//     zindex: 4000,
//     backgroundColor: 'rgba(252, 253, 255,1)',
//     rtl: false,
//     fontFamily: 'Quicksand',
//     cssAnimation: true,
//     cssAnimationDuration: 400,
//     clickToClose: false,
//     customSvgUrl: null,
//     customSvgCode: null,
//     svgSize: '70px',
//     svgColor: '#4096ff',
//     messageID: 'NotiflixLoadingMessage',
//     messageFontSize: '15px',
//     messageMaxLength: 34,
//     messageColor: '#000',
//     failure: {
//       background: '#F6C6C6',
//       textColor: '#C34A36'
//     },
//     success: {
//       background: '#C3F6C6',
//       textColor: '#2A7F2A'
//     }
// });

Vue.component('apexchart', VueApexCharts)

Vue.config.productionTip = false
Vue.prototype.$notiflix = Notiflix;

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

Vue.use(VueAxios, axios)

Vue.use(Notifications, options)

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
