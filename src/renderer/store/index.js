import Vue from 'vue';
import Vuex from 'vuex';
import Actions from './actions';
import Getters from './getters';
import Mutations from './mutations';
import HttpMethod from '../../common/method-types';
import Auth from '../../common/auth-types';
import ContentType from '../../common/content-types';

Vue.use(Vuex);

export default function() {
  return new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
      networkStatus: 'online',
      auth: {
        selected: Auth.NONE,
        params: {}
      },
      request: {
        method: HttpMethod.GET,
        url: '',
        headers: [{ name: 'content-type', value: 'application/json', sendingStatus: true }],
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
