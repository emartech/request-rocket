import Vue from 'vue';
import Vuex from 'vuex';

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
  });
}
