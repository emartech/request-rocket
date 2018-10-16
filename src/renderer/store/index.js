import Vue from 'vue';
import Vuex from 'vuex';
import AuthOptions from './auth-options';
import httpMethodOptions from './method-options';
import Actions from './actions';
import Getters from './getters';
import Mutations from './mutations';
import HttpMethod from '../../common/method-types';
import ContentType from '../../common/content-types';

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
        httpMethodOptions,
        method: HttpMethod.GET,
        url: '',
        headers: [{ name: 'content-type', value: 'application/json' }],
        body: '',
        contentType: ContentType.custom
      },
      response: {},
      sentRequestHeaders: null
    },
    getters: Getters,
    mutations: Mutations,
    actions: Actions
  });
}
