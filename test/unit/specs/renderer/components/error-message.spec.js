import { shallowMount } from '@vue/test-utils';
import ErrorMessage from '@/components/error-message';
import createStore from '@/store';
import sinon from 'sinon';
import Mutation from '../../../../../src/renderer/store/mutation-types';

describe('ErrorMessage.vue', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('should render the error message', () => {
    const component = shallowMount(ErrorMessage, { store });

    store.commit(Mutation.ADD_ERROR_MESSAGE, 'error occurred');
    store.commit(Mutation.ADD_ERROR_MESSAGE, 'another error occurred');

    const errorMessageElement = component.find('#error-message');

    expect(errorMessageElement.exists()).to.eql(true);
    expect(errorMessageElement.text()).to.match(/error occurred.*another error occurred/);
  });

  context('after 5 seconds pass', () => {
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should clear error messages', () => {
      const component = shallowMount(ErrorMessage, { store });

      store.commit(Mutation.ADD_ERROR_MESSAGE, 'error occurred');
      clock.tick(5000);

      const errorMessageElement = component.find('#error-message');

      expect(errorMessageElement.exists()).to.eql(false);
    });
  });
});
