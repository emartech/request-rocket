import Mutation from '../../../../../src/renderer/store/mutation-types';
import HttpMethod from '../../../../../src/common/method-types';
import createStore, { initialState } from '../../../../../src/renderer/store';
import ContentType from '../../../../../src/common/content-types';
import Auth from '../../../../../src/common/auth-types';

describe('mutations', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  describe('UPDATE_URL', () => {
    it('should set the URL', () => {
      store.commit(Mutation.UPDATE_URL, 'https://some.url');
      expect(store.state.request.url).to.eql('https://some.url');
    });
  });
  describe('RESET_STATE', () => {
    it('should revert the store back to its initial state', () => {
      store.commit(Mutation.UPDATE_URL, 'https://some.url');
      store.commit(Mutation.RESET_STATE);
      expect(store.state).to.eql(initialState);
    });
  });
  describe('UPDATE_RESPONSE', () => {
    it('should set the response object', () => {
      store.commit(Mutation.UPDATE_RESPONSE, { body: '{}' });
      expect(store.state.response).to.eql({ body: '{}' });
    });
  });
  describe('SET_SENT_REQUEST_HEADERS', () => {
    it('should set the actual headers of the dispatched request', () => {
      store.commit(Mutation.SET_SENT_REQUEST_HEADERS, { accept: '*/*' });
      expect(store.state.sentRequestHeaders).to.eql({ accept: '*/*' });
    });
  });
  describe('SELECT_AUTH_TYPE', () => {
    it('should set the selected authentication type', () => {
      store.commit(Mutation.SELECT_AUTH_TYPE, Auth.WSSE);
      expect(store.state.auth.selected).to.eql(Auth.WSSE);
    });
  });
  describe('SELECT_HTTP_METHOD', () => {
    it('should set the selected http method', () => {
      store.commit(Mutation.SELECT_HTTP_METHOD, HttpMethod.POST);
      expect(store.state.request.method).to.eql(HttpMethod.POST);
    });
  });
  describe('SET_AUTH_PARAMS', () => {
    it('should set the parameters for the selected authentication', () => {
      const wsseParams = { key: null, secret: null };
      store.commit(Mutation.SET_AUTH_PARAMS, wsseParams);
      expect(store.state.auth.params).to.eql(wsseParams);
    });
  });
  describe('UPDATE_NETWORK_STATUS', function() {
    it('should set network status property', () => {
      const networkStatus = 'online';
      store.commit(Mutation.UPDATE_NETWORK_STATUS, networkStatus);
      expect(store.state.networkStatus).to.eq(networkStatus);
    });
  });
  describe('SET_REQUEST_BODY', function() {
    it('should set the body on the request object', () => {
      const updatedBody = 'new body content';
      store.commit(Mutation.SET_REQUEST_BODY, updatedBody);
      expect(store.state.request.body).to.eq(updatedBody);
    });
  });
  describe('SELECT_CONTENT_TYPE', () => {
    it('should set the selected content type', () => {
      store.commit(Mutation.SELECT_CONTENT_TYPE, ContentType.json);
      expect(store.state.request.contentType).to.eql(ContentType.json);
    });
  });
  describe('SET_REQUEST_HEADERS', function() {
    it('should set the headers on the request object', () => {
      const updatedHeaders = [{ name: 'content-type', value: 'application/json' }, { name: 'accept', value: '*/*' }];
      store.commit(Mutation.SET_REQUEST_HEADERS, updatedHeaders);
      expect(store.state.request.headers).to.eq(updatedHeaders);
    });
  });
  describe('ADD_REQUEST_HEADER', function() {
    it('should add a header to the requests headers', () => {
      store.commit(Mutation.ADD_REQUEST_HEADER, { name: 'accept', value: 'application/json' });

      expect(store.state.request.headers).to.eql([{ name: 'accept', value: 'application/json' }]);
    });
  });
  describe('UPDATE_REQUEST_HEADER', function() {
    it('should update existing header on the requests headers', () => {
      store.commit(Mutation.ADD_REQUEST_HEADER, { name: 'content-type', value: 'application/json' });

      store.commit(Mutation.UPDATE_REQUEST_HEADER, { name: 'content-type', value: 'text/plain' });

      expect(store.state.request.headers).to.eql([{ name: 'content-type', value: 'text/plain' }]);
    });
  });
  describe('SET_ERROR_MESSAGE', function() {
    it('should set the error message', () => {
      store.commit(Mutation.SET_ERROR_MESSAGE, 'error occurred');
      expect(store.state.error.message).to.equal('error occurred');
    });
  });
  describe('SET_ERROR_VISIBLE', function() {
    it('should set the error visibility', () => {
      store.commit(Mutation.SET_ERROR_VISIBLE, true);
      expect(store.state.error.visible).to.equal(true);
    });
  });
  describe('SET_ERROR_TIMEOUT_ID', function() {
    it('should set the timeout ID', () => {
      store.commit(Mutation.SET_ERROR_TIMEOUT_ID, 0);
      expect(store.state.error.timeoutID).to.equal(0);
    });
  });
  describe('REQUEST_IN_PROGRESS', function() {
    it('should indicate that the request is being processed', () => {
      store.commit(Mutation.REQUEST_IN_PROGRESS);
      expect(store.state.sendingInProgress).to.equal(true);
    });
  });
  describe('REQUEST_FINISHED_OR_ABORTED', function() {
    it('should indicate that the no message is is being dispatched', () => {
      store.commit(Mutation.REQUEST_FINISHED_OR_ABORTED);
      expect(store.state.sendingInProgress).to.equal(false);
    });
  });

  describe('validatorErrors', () => {
    describe('ADD_VALIDATOR_ERROR', function() {
      it('should add a validator error to the state', () => {
        store.commit(Mutation.ADD_VALIDATOR_ERROR, { type: 'url', message: 'URL cannot be empty' });
        expect(store.state.validatorErrors).to.eql([{ type: 'url', message: 'URL cannot be empty' }]);
      });
    });
    describe('CLEAR_VALIDATOR_ERRORS', function() {
      it('should remove validator errors by type if type is specified', () => {
        store.commit(Mutation.ADD_VALIDATOR_ERROR, { type: 'header', message: 'Header cannot be empty' });
        store.commit(Mutation.ADD_VALIDATOR_ERROR, { type: 'url', message: 'URL cannot be empty' });

        store.commit(Mutation.CLEAR_VALIDATOR_ERRORS, 'url');

        expect(store.state.validatorErrors).to.eql([{ type: 'header', message: 'Header cannot be empty' }]);
      });
      it('should remove all validator errors if type is not specified', () => {
        store.commit(Mutation.ADD_VALIDATOR_ERROR, { type: 'header', message: 'Header cannot be empty' });
        store.commit(Mutation.ADD_VALIDATOR_ERROR, { type: 'url', message: 'URL cannot be empty' });

        store.commit(Mutation.CLEAR_VALIDATOR_ERRORS);

        expect(store.state.validatorErrors).to.eql([]);
      });
    });
  });
});
