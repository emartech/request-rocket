import Vue from 'vue';
import Vuex from 'vuex';
import { ipcRenderer } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import Mutation from './mutation-types';
import Action from './action-types';

Vue.use(Vuex);

export default function () {
  return new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
      url: '',
    },
    mutations: {
      [Mutation.UPDATE_URL](state, url) {
        state.url = url;
      },
    },
    actions: {
      [Action.setUrl]({ commit }, url) {
        commit(Mutation.UPDATE_URL, url);
      },
      async [Action.sendRequest]({ state }) {
        await ipcRenderer.send('send-request', { url: state.url });
      },
    },
  });
}
