import Vue from 'vue';
import splitPane from 'vue-splitpane';
import { ipcRenderer } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies

import App from './app';
import router from './router';
import createStore from './store';
import Action from './store/action-types';
import Channels from '../common/ipc-channels';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));

Vue.config.productionTip = false;
Vue.config.ignoredElements = [/^e-/];
Vue.component('split-pane', splitPane);

const store = createStore();

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app');

ipcRenderer.on(Channels.RECEIVE_RESPONSE, (event, args) => {
  store.dispatch(Action.receiveResponse, args);
});

ipcRenderer.on(Channels.UNEXPECTED_ERROR, (event, errorMessage) => {
  store.dispatch(Action.indicateBackendError, errorMessage);
});

ipcRenderer.on(Channels.REQUEST_CANCELLED, () => {
  store.dispatch(Action.requestCancelled);
});

ipcRenderer.on(Channels.FILE_SAVE_RESULT, (event, fileSaveResult) => {
  store.dispatch(Action.fileSaveResult, fileSaveResult);
});

ipcRenderer.on(Channels.FILE_LOAD_RESULT, (event, fileLoadResult) => {
  store.dispatch(Action.fileLoadResult, fileLoadResult);
});
