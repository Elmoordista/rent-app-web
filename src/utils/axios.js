import axios from "axios";

import NotificationService from '../plugins/notificationService'

const HttpClient = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

HttpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${token}`,
  };
  return config;
});

// Cookies.remove('company_id');

const responseErrorInterceptor = (error) => {
  if ((error.response && error.response.status == 401)) {
    // if ((error.response && error.response.status == 401) || error.code == "ERR_NETWORK" || error.code == "ERR_BAD_RESPONSE") {
      localStorage.removeItem('token');
      window.location.href = '/login';
  }
  if ((error.response && error.response.data.message)) {
      showError(error.response.data.message)
  }
};

function showError(msg) {
  NotificationService.notifyError(
    {
      message: msg,
      title: 'Request Error',
    }
  )
}

HttpClient.interceptors.response.use(
  (response) => response,
  responseErrorInterceptor
);

export default HttpClient;
