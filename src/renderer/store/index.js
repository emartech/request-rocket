import Vue from 'vue';
import Vuex from 'vuex';
import Mutation from './mutation-types';
import AuthOptions from './auth-options';
import Actions from './actions';
import Getters from './getters';

Vue.use(Vuex);

export default function() {
  return new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
      networkStatus: 'online',
      auth: {
        types: AuthOptions,
        selected: AuthOptions[0],
        params: {}
      },
      request: {
        url: ''
      },
      response: {},
      requestHeaders: null
    },
    getters: Getters,
    mutations: {
      [Mutation.UPDATE_URL](state, url) {
        state.request.url = url;
      },
      [Mutation.UPDATE_REQUEST_HEADERS](state, requestHeaders) {
        state.requestHeaders = requestHeaders;
      },
      [Mutation.UPDATE_RESPONSE](state, response) {
        state.response = response;
      },
      [Mutation.SELECT_AUTH_TYPE](state, selected) {
        state.auth.selected = selected;
      },
      [Mutation.SET_AUTH_PARAMS](state, authParams) {
        state.auth.params = authParams;
      },
      [Mutation.UPDATE_NETWORK_STATUS](state, networkStatus) {
        state.networkStatus = networkStatus;
      }
    },
    actions: Actions
  });
}
