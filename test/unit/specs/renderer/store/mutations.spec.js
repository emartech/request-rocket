import Mutation from '../../../../../src/renderer/store/mutation-types';
import HttpMethod from '../../../../../src/common/method-types';
import createStore from '../../../../../src/renderer/store';
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
});
