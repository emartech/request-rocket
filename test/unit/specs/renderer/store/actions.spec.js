import sinon from 'sinon';
import { ipcRenderer } from 'electron';
import Action from '../../../../../src/renderer/store/action-types';
import Mutation from '../../../../../src/renderer/store/mutation-types';
import Actions from '../../../../../src/renderer/store/actions';
import HttpMethod from '../../../../../src/common/method-types';
import createStore from '../../../../../src/renderer/store';

describe('actions', () => {
  let store;

  beforeEach(() => {
    store = createStore();
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
    it('should send event to the backend with correct payload', () => {
      const ipcSpy = sinon.spy(ipcRenderer, 'send');

      const selectedAuthType = { id: 'wsse', label: 'WSSE' };
      const authParams = { key: 'wssekey', secret: 'wssesecret' };
      const url = 'https://request.url';

      store.commit(Mutation.UPDATE_URL, url);
      store.commit(Mutation.SELECT_AUTH_TYPE, selectedAuthType);
      store.commit(Mutation.SET_AUTH_PARAMS, authParams);
      store.dispatch(Action.sendRequest);

      expect(ipcSpy.called).to.equal(true);
      const channel = ipcSpy.lastCall.args[0];
      const payload = ipcSpy.lastCall.args[1];
      expect(channel).to.equal('send-request');
      expect(payload).to.include({ url });
      expect(payload).to.include({ authType: selectedAuthType.id });
      expect(payload).to.include({ authParams });
    });
  });
  describe('receiveResponse', () => {
    it('should store the received response in the store', () => {
      store.dispatch(Action.receiveResponse, { response: { body: '{"key": "value"}' } });
      expect(store.state.response).to.eql({ body: '{"key": "value"}' });
    });
    it('should store the actual request headers in the store', () => {
      store.dispatch(Action.receiveResponse, { requestHeaders: { 'x-my-header': 'some_value' } });
      expect(store.state.requestHeaders).to.eql({ 'x-my-header': 'some_value' });
    });
  });
  describe('selectAuthType', () => {
    it('should modify the selected auth type of the state', () => {
      const commit = sinon.spy();
      const wsseAuthType = { id: 'wsse', label: 'WSSE' };
      Actions[Action.selectAuthType]({ commit, state: store.state }, wsseAuthType.id);
      expect(commit.calledWith(Mutation.SELECT_AUTH_TYPE, wsseAuthType)).eql(true);
    });
    it('should set auth params to their initial value', () => {
      const commit = sinon.spy();
      const wsseAuthType = { id: 'wsse', label: 'WSSE' };
      Actions[Action.selectAuthType]({ commit, state: store.state }, wsseAuthType.id);
      expect(commit.calledWith(Mutation.SELECT_AUTH_TYPE, wsseAuthType)).eql(true);
      expect(commit.calledWith(Mutation.SET_AUTH_PARAMS, {})).eql(true);
    });
  });
  describe('selectHttpMethod', () => {
    it('should modify the selected http method of the state', () => {
      const commit = sinon.spy();
      Actions[Action.selectHttpMethod]({ commit }, HttpMethod.GET);
      expect(commit.calledWith(Mutation.SELECT_HTTP_METHOD, HttpMethod.GET)).eql(true);
    });
  });
  describe('setAuthParams', () => {
    it('should modify the parameters of the auth', () => {
      const commit = sinon.spy();
      const wsseParams = { key: null, secret: null };
      Actions[Action.setAuthParams]({ commit }, wsseParams);
      expect(commit.calledWith(Mutation.SET_AUTH_PARAMS, wsseParams)).eql(true);
    });
  });
});
