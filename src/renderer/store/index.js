import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { clone } from 'ramda';
import Actions from './actions';
import Getters from './getters';
import Mutations from './mutations';
import HttpMethod from '../../common/method-types';
import Auth from '../../common/auth-types';
import ContentType from '../../common/content-types';

Vue.use(Vuex);

export const initialState = {
  networkStatus: 'online',
  errorMessage: null,
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
  sentRequestHeaders: null,
  sendingInProgress: false
};

export default function() {
  return new Store({
    strict: process.env.NODE_ENV !== 'production',
    state: clone(initialState),
    getters: Getters,
    mutations: Mutations,
    actions: Actions
  });
}
