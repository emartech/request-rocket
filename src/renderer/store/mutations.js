import { clone } from 'ramda';
import Mutation from './mutation-types';
import { initialState } from './index';

export default {
  [Mutation.UPDATE_URL](state, url) {
    state.request.url = url;
  },
  [Mutation.RESET_STATE]() {
    this.replaceState(clone(initialState));
  },
  [Mutation.SET_SENT_REQUEST_HEADERS](state, requestHeaders) {
    state.sentRequestHeaders = requestHeaders;
  },
  [Mutation.UPDATE_RESPONSE](state, response) {
    state.response = response;
  },
  [Mutation.SELECT_AUTH_TYPE](state, selected) {
    state.auth.selected = selected;
  },
  [Mutation.SET_AUTH_PARAMS](state, authParams) {
    state.auth.params = authParams;
  },
  [Mutation.UPDATE_NETWORK_STATUS](state, networkStatus) {
    state.networkStatus = networkStatus;
  },
  [Mutation.SELECT_HTTP_METHOD](state, httpMethod) {
    state.request.method = httpMethod;
  },
  [Mutation.SET_REQUEST_BODY](state, body) {
    state.request.body = body;
  },
  [Mutation.SELECT_CONTENT_TYPE](state, contentType) {
    state.request.contentType = contentType;
  },
  [Mutation.SET_REQUEST_HEADERS](state, requestHeaders) {
    state.request.headers = requestHeaders;
  },
  [Mutation.ADD_REQUEST_HEADER](state, newHeader) {
    state.request.headers.push(newHeader);
  },
  [Mutation.UPDATE_REQUEST_HEADER](state, updatedHeader) {
    const oldHeader = state.request.headers.find(header => header.name === updatedHeader.name);
    Object.assign(oldHeader, updatedHeader);
  },
  [Mutation.SET_ERROR_MESSAGE](state, errorMessage) {
    state.errorMessage = errorMessage;
  }
};
