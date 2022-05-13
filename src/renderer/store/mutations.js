import { mergeLeft, clone } from 'ramda';
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
  [Mutation.MERGE_AUTH_PARAMS](state, authParams) {
    state.auth.params = mergeLeft(authParams, state.auth.params);
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
  [Mutation.ADD_ERROR_MESSAGE](state, errorMessage) {
    state.errors.push(errorMessage);
  },
  [Mutation.CLEAR_ERRORS](state) {
    state.errors = [];
  },
  [Mutation.REQUEST_IN_PROGRESS](state) {
    state.sendingInProgress = true;
  },
  [Mutation.REQUEST_FINISHED_OR_ABORTED](state) {
    state.sendingInProgress = false;
  },
  [Mutation.ADD_VALIDATOR_ERROR](state, { type, message }) {
    state.validatorErrors.push({ type, message });
  },
  [Mutation.CLEAR_VALIDATOR_ERRORS](state, type) {
    if (type == null) {
      state.validatorErrors = [];
    } else {
      state.validatorErrors = state.validatorErrors.filter(error => error.type !== type);
    }
  },
  [Mutation.SET_REQUEST_ID](state, uuid) {
    state.uuid = uuid;
  },
  [Mutation.ADD_INFO_MESSAGE](state, message) {
    state.infoMessage = message;
  },
  [Mutation.CLEAR_INFO_MESSAGE](state) {
    state.infoMessage = '';
  }
};
