import Vue from 'vue';
import Vuex from 'vuex';
import { ipcRenderer } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies

Vue.use(Vuex);

export default function () {
  return new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
      url: '',
    },
    mutations: {
      UPDATE_URL(state, url) {
        state.url = url;
      },
    },
    actions: {
      setUrl({ commit }, url) {
        commit('UPDATE_URL', url);
      },
      async sendRequest({ state }) {
        await ipcRenderer.send('send-request', { url: state.url });
      },
    },
  });
}
