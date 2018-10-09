import { ipcRenderer } from 'electron';
import sinon from 'sinon';
import createStore from '../../../../../src/renderer/store';
import Actions from '../../../../../src/renderer/store/actions';
import Action from '../../../../../src/renderer/store/action-types';
import Mutation from '../../../../../src/renderer/store/mutation-types';
import Auth from '../../../../../src/common/auth-types';

describe('Store', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  describe('state', () => {
    describe('auth types', () => {
      it('should have a list of type mapping', () => {
        expect(Array.isArray(store.state.auth.types)).to.eql(true);
        expect(store.state.auth.types.length).to.eql(Object.keys(Auth).length);
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
    describe('SELECT_AUTH_TYPE', () => {
      it('should set the selected authentication type', () => {
        const wsseAuthType = { id: 'wsse', label: 'WSSE' };
        store.commit(Mutation.SELECT_AUTH_TYPE, wsseAuthType);
        expect(store.state.auth.selected).to.eql(wsseAuthType);
      });
    });
    describe('SET_AUTH_PARAMS', () => {
      it('should set the parameters for the selected authentication', () => {
        const wsseParams = { key: null, secret: null };
        store.commit(Mutation.SET_AUTH_PARAMS, wsseParams);
        expect(store.getters.authParams).to.eql(wsseParams);
      });
    });
  });
  describe('actions', () => {
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
        store.dispatch(Action.receiveResponse, { body: '{"key": "value"}' });
        expect(store.state.response).to.eql({ body: '{"key": "value"}' });
      });
    });
    describe('selectAuthType', () => {
      it('should modify the selected auth type of the state', () => {
        const commit = sinon.spy();
        const wsseAuthType = { id: 'wsse', label: 'WSSE' };
        Actions[Action.selectAuthType]({ commit, state: store.state }, wsseAuthType.id);
        expect(commit.calledWith(Mutation.SELECT_AUTH_TYPE, wsseAuthType)).eql(true);
      });
      it('should modify the selected auth type of the state', () => {
        const commit = sinon.spy();
        const wsseAuthType = { id: 'wsse', label: 'WSSE' };
        Actions[Action.selectAuthType]({ commit, state: store.state }, wsseAuthType.id);
        expect(commit.calledWith(Mutation.SELECT_AUTH_TYPE, wsseAuthType)).eql(true);
        expect(commit.calledWith(Mutation.SET_AUTH_PARAMS, {})).eql(true);
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
});
