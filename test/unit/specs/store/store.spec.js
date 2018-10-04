import { ipcRenderer } from 'electron';
import sinon from 'sinon';
import createStore from '@/store';

describe('Store', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  describe('state', () => {
    describe('url', () => {
      it('should have empty string as initial value', () => {
        expect(store.state.url).to.eql('');
      });
    });
  });
  describe('mutations', () => {
    describe('UPDATE_URL', () => {
      it('should set the URL', () => {
        store.commit('UPDATE_URL', 'https://some.url');
        expect(store.state.url).to.eql('https://some.url');
      });
    });
  });
  describe('actions', () => {
    describe('setUrl', () => {
      it('should modify the URL of the state', () => {
        store.dispatch('setUrl', 'https://new.url');
        expect(store.state.url).to.eql('https://new.url');
      });
    });
    describe('sendRequest', () => {
      it('should send event to the backend', () => {
        const ipcSpy = sinon.spy(ipcRenderer, 'send');
        store.commit('UPDATE_URL', 'https://request.url');

        store.dispatch('sendRequest');

        expect(ipcSpy.calledWith('send-request', { url: 'https://request.url' })).to.eql(true);
      });
    });
  });
});
