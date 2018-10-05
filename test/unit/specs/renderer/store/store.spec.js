import { ipcRenderer } from 'electron';
import sinon from 'sinon';
import createStore from '@/store';
import Action from '@/store/action-types';
import Mutation from '@/store/mutation-types';

describe('Store', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  describe('state', () => {
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
  });
  describe('actions', () => {
    describe('setUrl', () => {
      it('should modify the URL of the state', () => {
        store.dispatch(Action.setUrl, 'https://new.url');
        expect(store.state.request.url).to.eql('https://new.url');
      });
    });
    describe('sendRequest', () => {
      it('should send event to the backend', () => {
        const ipcSpy = sinon.spy(ipcRenderer, 'send');
        store.commit(Mutation.UPDATE_URL, 'https://request.url');

        store.dispatch(Action.sendRequest);

        expect(ipcSpy.calledWith('send-request', { url: 'https://request.url' })).to.eql(true);
      });
    });
    describe('receiveResponse', () => {
      it('should store the received response in the store', () => {
        store.dispatch(Action.receiveResponse, { body: '{"key": "value"}' });
        expect(store.state.response).to.eql({ body: '{"key": "value"}' });
      });
    });
  });
});
