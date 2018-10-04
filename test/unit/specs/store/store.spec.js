import createStore from '../../../../src/renderer/store';

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
});
