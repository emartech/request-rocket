import { shallowMount } from '@vue/test-utils';
import App from '../../../../src/renderer/app';
import createStore from '../../../../src/renderer/store';

describe('App.vue', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  describe('network status', () => {
    it('should change if global events are triggered', () => {
      shallowMount(App, { store });

      window.dispatchEvent(new Event('offline'));
      expect(store.state.networkStatus).to.equal('offline');

      window.dispatchEvent(new Event('online'));
      expect(store.state.networkStatus).to.equal('online');
    });
  });
});
