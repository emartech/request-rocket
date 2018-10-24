import sinon from 'sinon';
import { ipcRenderer } from 'electron';
import { clone } from 'ramda';
import Action from '../../../../../src/renderer/store/action-types';
import Mutation from '../../../../../src/renderer/store/mutation-types';
import Actions from '../../../../../src/renderer/store/actions';
import createStore from '../../../../../src/renderer/store';
import HttpMethod from '../../../../../src/common/method-types';
import Auth from '../../../../../src/common/auth-types';
import ContentType from '../../../../../src/common/content-types';

describe('actions', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('setNetworkStatus', () => {
    it('should update the state of the network status', () => {
      store.dispatch(Action.setNetworkStatus, 'offline');
      expect(store.state.networkStatus).to.eql('offline');
    });
  });
  describe('setUrl', () => {
    it('should modify the URL of the state', () => {
      store.dispatch(Action.setUrl, 'https://new.url');
      expect(store.state.request.url).to.eql('https://new.url');
    });
  });
  describe('sendRequest', () => {
    let ipcSpy;

    beforeEach(() => {
      ipcSpy = sinon.spy(ipcRenderer, 'send');
    });

    it('should send the request URL', () => {
      store.commit(Mutation.UPDATE_URL, 'https://request.url');

      store.dispatch(Action.sendRequest);

      expect(ipcSpy).to.be.calledWith('send-request', sinon.match.has('url', 'https://request.url'));
    });
    it('should send the selected authentication with the belonging params', () => {
      const authParams = { key: 'wssekey', secret: 'wssesecret' };

      store.commit(Mutation.SELECT_AUTH_TYPE, Auth.WSSE);
      store.commit(Mutation.SET_AUTH_PARAMS, authParams);

      store.dispatch(Action.sendRequest);

      expect(ipcSpy).to.be.calledWith('send-request', sinon.match({ authType: Auth.WSSE, authParams }));
    });
    it('should send the request method', () => {
      store.commit(Mutation.SELECT_HTTP_METHOD, HttpMethod.POST);

      store.dispatch(Action.sendRequest);

      expect(ipcSpy).to.be.calledWith('send-request', sinon.match.has('method', HttpMethod.POST));
    });
    [
      { method: HttpMethod.GET, expectedBody: null },
      { method: HttpMethod.HEAD, expectedBody: null },
      { method: HttpMethod.POST, expectedBody: '{"foo": "bar"}' },
      { method: HttpMethod.PUT, expectedBody: '{"foo": "bar"}' },
      { method: HttpMethod.PATCH, expectedBody: '{"foo": "bar"}' },
      { method: HttpMethod.OPTIONS, expectedBody: '{"foo": "bar"}' }
    ].forEach(({ method, expectedBody }) => {
      it(`should send the ${method} request with body ${expectedBody}`, () => {
        store.commit(Mutation.SET_REQUEST_BODY, '{"foo": "bar"}');
        store.commit(Mutation.SELECT_HTTP_METHOD, method);
        store.dispatch(Action.sendRequest);

        expect(ipcSpy).to.be.calledWith('send-request', sinon.match.has('body', expectedBody));
      });
    });

    it('should send the desired request headers', () => {
      store.commit(Mutation.SET_REQUEST_HEADERS, [
        { name: 'content-type', value: 'application/json', sendingStatus: true },
        { name: 'accept', value: '*/*', sendingStatus: false }
      ]);
      store.dispatch(Action.sendRequest);

      expect(ipcSpy).to.be.calledWith(
        'send-request',
        sinon.match.has('headers', [{ name: 'content-type', value: 'application/json', sendingStatus: true }])
      );
    });
    it('should indicate request in progress', () => {
      const commit = sinon.spy();

      Actions[Action.sendRequest]({ commit });

      expect(commit).to.be.calledWithExactly(Mutation.REQUEST_IN_PROGRESS);
    });
  });
  describe('receiveResponse', () => {
    it('should store the received response in the store', () => {
      store.dispatch(Action.receiveResponse, { response: { body: '{"key": "value"}' } });
      expect(store.state.response).to.eql({ body: '{"key": "value"}' });
    });
    it('should store the actual request headers in the store', () => {
      store.dispatch(Action.receiveResponse, { requestHeaders: { 'x-my-header': 'some_value' } });
      expect(store.state.sentRequestHeaders).to.eql({ 'x-my-header': 'some_value' });
    });
    it('should indicate finished request', () => {
      const commit = sinon.spy();

      Actions[Action.receiveResponse]({ commit }, { response: {} });

      expect(commit).to.be.calledWithExactly(Mutation.REQUEST_FINISHED_OR_ABORTED);
    });
  });
  describe('selectAuthType', () => {
    it('should modify the selected auth type of the state', () => {
      const commit = sinon.spy();
      Actions[Action.selectAuthType]({ commit }, Auth.WSSE);
      expect(commit).to.be.calledWithExactly(Mutation.SELECT_AUTH_TYPE, Auth.WSSE);
    });
    it('should set auth params to their initial value', () => {
      const commit = sinon.spy();
      Actions[Action.selectAuthType]({ commit }, Auth.WSSE);
      expect(commit).to.be.calledWithExactly(Mutation.SET_AUTH_PARAMS, {});
    });
  });
  describe('selectHttpMethod', () => {
    it('should modify the selected http method of the state', () => {
      const commit = sinon.spy();
      Actions[Action.selectHttpMethod]({ commit }, HttpMethod.GET);
      expect(commit).to.be.calledWithExactly(Mutation.SELECT_HTTP_METHOD, HttpMethod.GET);
    });
  });
  describe('setAuthParams', () => {
    it('should modify the parameters of the auth', () => {
      const commit = sinon.spy();
      const wsseParams = { key: null, secret: null };
      Actions[Action.setAuthParams]({ commit }, wsseParams);
      expect(commit).to.be.calledWithExactly(Mutation.SET_AUTH_PARAMS, wsseParams);
    });
  });
  describe('setRequestBody', () => {
    it('should modify the request body', () => {
      const commit = sinon.spy();
      const requestBody = '{"foo":"bar"}';
      Actions[Action.setRequestBody]({ commit }, requestBody);
      expect(commit).to.be.calledWithExactly(Mutation.SET_REQUEST_BODY, requestBody);
    });
  });
  describe('selectContentType', () => {
    it('should modify the selected content type of the state', () => {
      const commit = sinon.spy();
      Actions[Action.selectContentType]({ commit, state: store.state }, ContentType.json);
      expect(commit).to.be.calledWithExactly(Mutation.SELECT_CONTENT_TYPE, ContentType.json);
    });
    it('should update the existing content type header', () => {
      const commit = sinon.spy();
      const expectedHeader = { name: 'content-type', value: ContentType.text, sendingStatus: true };
      Actions[Action.selectContentType]({ commit, state: store.state }, ContentType.text);
      expect(commit).to.be.calledWithExactly(Mutation.UPDATE_REQUEST_HEADER, expectedHeader);
    });
    it('should add a content type header if not exists', () => {
      store.commit(Mutation.SET_REQUEST_HEADERS, []);
      const commit = sinon.spy();
      const expectedHeader = { name: 'content-type', value: ContentType.text, sendingStatus: true };
      Actions[Action.selectContentType]({ commit, state: store.state }, ContentType.text);
      expect(commit).to.be.calledWithExactly(Mutation.ADD_REQUEST_HEADER, expectedHeader);
    });
    context('when selected content type is custom', () => {
      it('should not update the content type header', () => {
        const oldHeaders = clone(store.state.request.headers);
        store.dispatch(Action.selectContentType, ContentType.custom);
        expect(store.state.request.headers).to.eql(oldHeaders);
      });
      it('should not add the content type header', () => {
        store.commit(Mutation.SET_REQUEST_HEADERS, []);
        const oldHeaders = clone(store.state.request.headers);
        store.dispatch(Action.selectContentType, ContentType.custom);
        expect(store.state.request.headers).to.eql(oldHeaders);
      });
    });
  });
  describe('setRequestHeaders', () => {
    it('should set the request headers', () => {
      const commit = sinon.spy();
      const headers = [{ name: 'content-type', value: ContentType.json }, { name: 'accept', value: '*/*' }];
      Actions[Action.setRequestHeaders]({ commit }, headers);
      expect(commit).to.be.calledWithExactly(Mutation.SET_REQUEST_HEADERS, headers);
    });
  });
  describe('resetState', () => {
    it('should commit the RESET_STATE mutation', () => {
      const commit = sinon.spy();
      Actions[Action.resetState]({ commit });
      expect(commit).to.be.calledWithExactly(Mutation.RESET_STATE);
    });
  });
  describe('setErrorMessage', () => {
    it('should commit the SET_ERROR_MESSAGE mutation', () => {
      const commit = sinon.spy();
      Actions[Action.setErrorMessage]({ commit }, 'error occurred');
      expect(commit).to.be.calledWithExactly(Mutation.SET_ERROR_MESSAGE, 'error occurred');
    });
  });
});
