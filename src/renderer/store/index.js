import Vue from 'vue';
import Vuex from 'vuex';
import Mutation from './mutation-types';
import AuthOptions from './auth-options';
import Actions from './actions';

Vue.use(Vuex);

export default function() {
  return new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
      auth: {
        types: AuthOptions,
        selected: AuthOptions[0],
        params: {}
      },
      request: {
        url: ''
      },
      response: {}
    },
    getters: {
      authTypes: state => state.auth.types,
      selectedAuthTypeId: state => state.auth.selected.id,
      authParams: state => state.auth.params
    },
    mutations: {
      [Mutation.UPDATE_URL](state, url) {
        state.request.url = url;
      },
      [Mutation.UPDATE_RESPONSE](state, response) {
        state.response = response;
      },
      [Mutation.SELECT_AUTH_TYPE](state, selected) {
        state.auth.selected = selected;
      },
      [Mutation.SET_AUTH_PARAMS](state, authParams) {
        state.auth.params = authParams;
      }
    },
    actions: Actions
  });
}
