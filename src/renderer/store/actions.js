import { ipcRenderer } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import Action from './action-types';
import Mutation from './mutation-types';

export default {
  [Action.setUrl]({ commit }, url) {
    commit(Mutation.UPDATE_URL, url);
  },
  async [Action.sendRequest]({ state }) {
    await ipcRenderer.send('send-request', { url: state.request.url });
  },
  [Action.receiveResponse]({ commit }, response) {
    commit(Mutation.UPDATE_RESPONSE, response);
  },
  [Action.selectAuthType]({ commit, state }, selectedType) {
    const selected = state.auth.types.find(auth => auth.id === selectedType);
    commit(Mutation.SELECT_AUTH_TYPE, selected);
  },
};
