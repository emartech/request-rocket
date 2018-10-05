import Vue from 'vue';
import Vuex from 'vuex';
import { ipcRenderer } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import Mutation from './mutation-types';
import Action from './action-types';

Vue.use(Vuex);

export default function() {
  return new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
      url: '',
      response: {},
    },
    mutations: {
      [Mutation.UPDATE_URL](state, url) {
        state.url = url;
      },
      [Mutation.UPDATE_RESPONSE](state, response) {
        state.response = response;
      },
    },
    actions: {
      [Action.setUrl]({ commit }, url) {
        commit(Mutation.UPDATE_URL, url);
      },
      async [Action.sendRequest]({ state }) {
        await ipcRenderer.send('send-request', { url: state.url });
      },
      [Action.receiveResponse]({ commit }, response) {
        commit(Mutation.UPDATE_RESPONSE, response);
      },
    },
  });
}
