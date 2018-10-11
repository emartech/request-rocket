import Vue from 'vue';
import axios from 'axios';
import { ipcRenderer } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies

import App from './app';
import router from './router';
import createStore from './store';
import Action from './store/action-types';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

const store = createStore();

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app');

ipcRenderer.on('receive-response', (event, args) => {
  store.dispatch(Action.receiveResponse, args);
});
