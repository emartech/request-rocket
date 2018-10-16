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
      method: state.request.method,
      headers: state.request.headers,
      body: getters.isRequestBodyEditAvailable ? state.request.body : null,
      authType: state.auth.selected,
      authParams: state.auth.params
    };
    await ipcRenderer.send('send-request', payload);
  },
  [Action.receiveResponse]({ commit }, response) {
    commit(Mutation.UPDATE_RESPONSE, response.response);
    commit(Mutation.SET_SENT_REQUEST_HEADERS, response.requestHeaders);
  },
  [Action.selectAuthType]({ commit }, selectedType) {
    commit(Mutation.SELECT_AUTH_TYPE, selectedType);
    commit(Mutation.SET_AUTH_PARAMS, {});
  },
  [Action.setAuthParams]({ commit }, authParams) {
    commit(Mutation.SET_AUTH_PARAMS, authParams);
  },
  [Action.setNetworkStatus]({ commit }, networkStatus) {
    commit(Mutation.UPDATE_NETWORK_STATUS, networkStatus);
  },
  [Action.selectHttpMethod]({ commit }, httpMethod) {
    commit(Mutation.SELECT_HTTP_METHOD, httpMethod);
  },
  [Action.setRequestBody]({ commit }, requestBody) {
    commit(Mutation.SET_REQUEST_BODY, requestBody);
  },
  [Action.selectContentType]({ commit }, contentType) {
    commit(Mutation.SELECT_CONTENT_TYPE, contentType);
  },
  [Action.setRequestHeaders]({ commit }, requestHeaders) {
    commit(Mutation.SET_REQUEST_HEADERS, requestHeaders);
  }
};
