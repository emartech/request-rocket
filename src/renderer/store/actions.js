import { ipcRenderer } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import { isEmpty } from 'ramda';
import Action from './action-types';
import Mutation from './mutation-types';
import ContentType from '../../common/content-types';
import Channels from '../../common/ipc-channels';

function addDefaultProtocolIfNoneSpecified(url) {
  if (!url.trim().match(/^(.+):\/\//)) {
    return `http://${url.trim()}`;
  }

  return url;
}

export default {
  [Action.setUrl]({ commit }, url) {
    commit(Mutation.CLEAR_VALIDATOR_ERRORS, 'url');
    commit(Mutation.UPDATE_URL, url);
  },
  async [Action.sendRequest]({ dispatch, commit, state, getters }) {
    commit(Mutation.UPDATE_RESPONSE, {});

    dispatch(Action.validateForms);

    if (!isEmpty(state.validatorErrors)) return;

    commit(Mutation.REQUEST_IN_PROGRESS);

    const payload = {
      url: addDefaultProtocolIfNoneSpecified(state.request.url),
      method: state.request.method,
      headers: getters.requestHeadersToSend,
      body: getters.isRequestBodyEditAvailable ? state.request.body : null,
      authType: state.auth.selected,
      authParams: state.auth.params
    };

    await ipcRenderer.send('send-request', payload);
  },
  async [Action.cancelRequest]() {
    await ipcRenderer.send(Channels.CANCEL_REQUEST);
  },
  [Action.requestCancelled]({ commit }) {
    commit(Mutation.REQUEST_FINISHED_OR_ABORTED);
  },
  [Action.receiveResponse]({ commit }, response) {
    commit(Mutation.UPDATE_RESPONSE, response.response);
    commit(Mutation.SET_SENT_REQUEST_HEADERS, response.requestHeaders);
    commit(Mutation.REQUEST_FINISHED_OR_ABORTED);
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
  [Action.selectContentType]({ commit, state }, contentType) {
    commit(Mutation.SELECT_CONTENT_TYPE, contentType);

    if (contentType !== ContentType.custom) {
      const newHeader = { name: 'content-type', value: contentType, sendingStatus: true };
      const oldHeader = state.request.headers.find(header => header.name === 'content-type');

      if (oldHeader) {
        commit(Mutation.UPDATE_REQUEST_HEADER, newHeader);
      } else {
        commit(Mutation.ADD_REQUEST_HEADER, newHeader);
      }
    }
  },
  [Action.setRequestHeaders]({ commit }, requestHeaders) {
    commit(Mutation.SET_REQUEST_HEADERS, requestHeaders);
  },
  [Action.resetState]({ commit }) {
    commit(Mutation.RESET_STATE);
  },
  [Action.indicateBackendError]({ commit }, errorMessage) {
    commit(Mutation.ADD_ERROR_MESSAGE, errorMessage);
    commit(Mutation.REQUEST_FINISHED_OR_ABORTED);
  },
  [Action.clearErrors]({ commit }) {
    commit(Mutation.CLEAR_ERRORS);
  },
  [Action.validateForms]({ commit, state }) {
    commit(Mutation.CLEAR_VALIDATOR_ERRORS);

    if (!state.request.url) {
      commit(Mutation.ADD_VALIDATOR_ERROR, { type: 'url', message: 'URL cannot be empty' });
    }

    state.request.headers.forEach(header => {
      if (header.sendingStatus && !header.name) {
        commit(Mutation.ADD_VALIDATOR_ERROR, { type: 'header', message: 'Header name cannot be empty' });
      }
    });

    if (state.validatorErrors) {
      state.validatorErrors.forEach(error => {
        commit(Mutation.ADD_ERROR_MESSAGE, error.message);
      });
    }
  }
};
