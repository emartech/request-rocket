import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { clone } from 'ramda';
import Actions from './actions';
import Getters from './getters';
import Mutations from './mutations';
import HttpMethod from '../../common/method-types';
import Auth from '../../common/auth-types';
import ContentType from '../../common/content-types';

Vue.use(Vuex);

export const initialState = {
  errors: [],
  validatorErrors: [],
  auth: {
    selected: Auth.NONE,
    params: {}
  },
  request: {
    method: HttpMethod.GET,
    url: '',
    headers: [],
    body: '',
    contentType: ContentType.custom
  },
  uuid: null,
  response: {},
  sentRequestHeaders: null,
  sendingInProgress: false
};

export default function() {
  const options = {
    strict: process.env.NODE_ENV !== 'production',
    state: clone(initialState),
    getters: Getters,
    mutations: Mutations,
    actions: Actions
  };

  if (process.env.NODE_ENV !== 'testing') {
    options.plugins = [createPersistedState()];
  }

  return new Store(options);
}
