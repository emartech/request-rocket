import store from '../../../../src/renderer/store';

describe('Store', () => {
  describe('state', () => {
    describe('url', () => {
      it('should have empty string as initial value', () => {
        expect(store.state.Request.url).to.eql('');
      });
    });
  });
  describe('mutations', () => {
    describe('UPDATE_URL', () => {
      it('should set the URL', () => {
        store.commit('UPDATE_URL', 'https://some.url');
        expect(store.state.Request.url).to.eql('https://some.url');
      });
    });
  });
});
