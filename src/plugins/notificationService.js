// notificationService.js
import Vue from 'vue';

const NotificationService = {
  notifySuccess(message, title) {
    Vue.prototype.$awn.success(message, title);
  },
  notifyError(message, title) {
    Vue.prototype.$awn.alert(message, title);
  }
};

export default NotificationService;
