import { ipcRenderer } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import Action from './action-types';
import Mutation from './mutation-types';

export default {
  [Action.setUrl]({ commit }, url) {
    commit(Mutation.UPDATE_URL, url);
  },
  async [Action.sendRequest]({ state, getters }) {
    const payload = {
      url: state.request.url,
      authType: getters.selectedAuthTypeId,
      authParams: getters.authParams
    };
    await ipcRenderer.send('send-request', payload);
  },
  [Action.receiveResponse]({ commit }, response) {
    commit(Mutation.UPDATE_RESPONSE, response.response);
  },
  [Action.selectAuthType]({ commit, state }, selectedType) {
    const selected = state.auth.types.find(auth => auth.id === selectedType);
    commit(Mutation.SELECT_AUTH_TYPE, selected);
    commit(Mutation.SET_AUTH_PARAMS, {});
  },
  [Action.setAuthParams]({ commit }, authParams) {
    commit(Mutation.SET_AUTH_PARAMS, authParams);
  },
  [Action.requestSent]({ commit }, payload) {
    commit(Mutation.UPDATE_SENT_HEADERS, payload.sentRequestHeaders);
  }
};
