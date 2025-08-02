import axios from "axios";

import Cookies from 'js-cookie';
import NotificationService from '@/plugins/notificationService'

const HttpClient = axios.create({
  baseURL: process.env.VUE_APP_ETOUSOFT_API_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// HttpClient.interceptors.request.use((config) => {
//   const token = Cookies.get('token');
//   config.headers = {
//     ...config.headers,
//     Authorization: `Bearer ${token}`,
//   };
//   return config;
// });

// Cookies.remove('company_id');

const responseErrorInterceptor = (error) => {
  // if ((error.response && error.response.status == 401)) {
  //   // if ((error.response && error.response.status == 401) || error.code == "ERR_NETWORK" || error.code == "ERR_BAD_RESPONSE") {
  //     // Cookies.remove('token');
  //     // window.location.href = '/login';
  //     }
  // }
  if (error.response.data) {
    var errors = error.response.data.errors
    if (errors) {
      for (var i in errors) {
        for (var msg in errors[i]) {
          showError(errors[i][msg])
        }
      }
    } else {
      showError(error.response.data.error)
    }
  }

};

HttpClient.interceptors.response.use(
  (response) => response,
  responseErrorInterceptor
);

function showError(msg) {
  NotificationService.notifyError(
    {
      message: msg,
      title: 'Request Error',
    }
  )
}


export default HttpClient;
