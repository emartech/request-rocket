import Mutation from './mutation-types';

export default {
  [Mutation.UPDATE_URL](state, url) {
    state.request.url = url;
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
  }
};
