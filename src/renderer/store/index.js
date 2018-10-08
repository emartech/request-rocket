import Vue from 'vue';
import Vuex from 'vuex';
import { ipcRenderer } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import Mutation from './mutation-types';
import Action from './action-types';
import Auth from '../../common/auth-types';

Vue.use(Vuex);

export default function() {
  return new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
      auth: {
        types: [
          {
            type: Auth.none,
            label: 'None',
          },
          {
            type: Auth.wsse,
            label: 'WSSE',
          },
        ],
      },
      request: {
        url: '',
      },
      response: {},
    },
    getters: {
      authTypes: state => state.auth.types,
    },
    mutations: {
      [Mutation.UPDATE_URL](state, url) {
        state.request.url = url;
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
        await ipcRenderer.send('send-request', { url: state.request.url });
      },
      [Action.receiveResponse]({ commit }, response) {
        commit(Mutation.UPDATE_RESPONSE, response);
      },
    },
  });
}
