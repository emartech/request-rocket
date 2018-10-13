import createStore from '../../../../../src/renderer/store';
import Getter from '../../../../../src/renderer/store/getters';
import Mutation from '../../../../../src/renderer/store/mutation-types';
import Auth from '../../../../../src/common/auth-types';
import HttpMethod from '../../../../../src/common/method-types';

describe('Store', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  describe('state', () => {
    describe('networkStatus', () => {
      it('should be set online as initial value', () => {
        expect(store.state.networkStatus).to.eql('online');
      });
    });
    describe('auth types', () => {
      it('should have a list of type mapping', () => {
        expect(Array.isArray(store.state.auth.types)).to.eql(true);
        expect(store.state.auth.types.length).to.eql(Object.keys(Auth).length);
      });
    });
    describe('request httpMethodOptions', () => {
      it('should have a list of http method options', () => {
        expect(store.state.request.httpMethodOptions).to.be.instanceOf(Array);
        expect(store.state.request.httpMethodOptions.length).to.eql(Object.keys(HttpMethod).length);
      });
    });
    describe('request method', () => {
      it('should have GET http method as initial value', () => {
        expect(store.state.request.method).to.eql(HttpMethod.GET);
      });
    });
    describe('selected auth type', () => {
      it('should have none auth type as initial value', () => {
        const noneAuthType = store.state.auth.types.find(auth => auth.id === 'none');
        expect(store.state.auth.selected).to.eql(noneAuthType);
      });
    });
    describe('auth params', () => {
      it('should have empty object as initial value', () => {
        expect(store.state.auth.params).to.eql({});
      });
    });
    describe('request', () => {
      it('should have url property as string value', () => {
        expect(store.state.request.url).to.eql('');
      });
      it('should have headers property as an object', () => {
        expect(typeof store.state.request.headers).to.eql('object');
      });
      it('should have content-type header property as a string', () => {
        expect(store.state.request.headers['content-type']).to.eql('application/json');
      });
      it('should have an empty request body by default', () => {
        expect(store.state.request.body).to.eql('');
      });
    });
    describe('response', () => {
      it('should have empty object as initial value', () => {
        expect(store.state.response).to.eql({});
      });
    });
  });
  describe('mutations', () => {
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
    describe('UPDATE_REQUEST_HEADERS', () => {
      it('should set the request.sentHeaders object', () => {
        store.commit(Mutation.UPDATE_REQUEST_HEADERS, { accept: '*/*' });
        expect(store.state.requestHeaders).to.eql({ accept: '*/*' });
      });
    });
    describe('SELECT_AUTH_TYPE', () => {
      it('should set the selected authentication type', () => {
        const wsseAuthType = { id: 'wsse', label: 'WSSE' };
        store.commit(Mutation.SELECT_AUTH_TYPE, wsseAuthType);
        expect(store.state.auth.selected).to.eql(wsseAuthType);
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
        expect(store.getters.authParams).to.eql(wsseParams);
      });
    });

    describe('UPDATE_NETWORK_STATUS', function() {
      it('should set network status property', () => {
        const networkStatus = 'online';
        store.commit(Mutation.UPDATE_NETWORK_STATUS, networkStatus);
        expect(store.state.networkStatus).to.eq(networkStatus);
      });
    });
  });
  describe('getters', () => {
    describe('isNetworkAvailable', () => {
      it('should return true when networkStatus is online', function() {
        const state = {
          networkStatus: 'online'
        };
        expect(Getter.isNetworkAvailable(state)).to.be.eql(true);
      });
      it('should return false when networkStatus is offline', function() {
        const state = {
          networkStatus: 'offline'
        };
        expect(Getter.isNetworkAvailable(state)).to.be.eql(false);
      });
    });
    describe('responseType', () => {
      it('should return application/json by default', function() {
        const state = {
          response: {}
        };
        expect(Getter.responseType(state)).to.be.eql('application/json');
      });

      it('should return response type when a response arrived', function() {
        const state = {
          response: {
            headers: { 'content-type': 'text/plain' }
          }
        };
        expect(Getter.responseType(state)).to.be.eql('text/plain');
      });

      it('should return only the response type when a response arrived', function() {
        const state = {
          response: {
            headers: { 'content-type': 'text/plain; charset=utf-8' }
          }
        };
        expect(Getter.responseType(state)).to.be.eql('text/plain');
      });
    });
  });
});
