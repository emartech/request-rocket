import { shallowMount } from '@vue/test-utils';
import ErrorMessage from '@/components/error-message';
import createStore from '@/store';
import Mutation from '../../../../../src/renderer/store/mutation-types';

describe('ErrorMessage.vue', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  context('SET_ERROR_MESSAGE', () => {
    it('should render the error message', () => {
      store.commit(Mutation.SET_ERROR_MESSAGE, 'error occurred');

      const component = shallowMount(ErrorMessage, { store });
      const errorMessageElement = component.find('#error-message');

      expect(errorMessageElement.exists()).to.eql(true);
      expect(errorMessageElement.text()).to.eql('error occurred');
    });
  });
  context('SET_ERROR_VISIBLE', () => {
    it('should add opened css class', () => {
      store.commit(Mutation.SET_ERROR_VISIBLE, true);

      const component = shallowMount(ErrorMessage, { store });
      const errorMessageElement = component.find('#error-message');

      expect(errorMessageElement.classes('opened')).to.equal(true);
    });
  });
});
