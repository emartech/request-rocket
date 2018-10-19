import { shallowMount } from '@vue/test-utils';
import RequestEditorTitle from '@/components/request-editor-title';
import createStore from '@/store';
import { initialState } from '../../../../../src/renderer/store';
import Mutation from '../../../../../src/renderer/store/mutation-types';

describe('RequestEditorTitle.vue', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('should render a header', () => {
    const component = shallowMount(RequestEditorTitle, { store });

    expect(component.find('h2').exists()).to.eql(true);
    expect(component.find('h2').text()).to.eql('Request');
  });
  it('should render a reset button', () => {
    const component = shallowMount(RequestEditorTitle, { store });

    expect(component.find('button.reset-state').exists()).to.eql(true);
  });
  context('when reset button is clicked', () => {
    it('should revert the store back to its initial state', () => {
      const component = shallowMount(RequestEditorTitle, { store });
      const resetButton = component.find('button.reset-state');

      store.commit(Mutation.UPDATE_URL, 'https://some.url');
      resetButton.trigger('click');

      expect(store.state).to.eql(initialState);
    });
  });
});
