import { shallowMount } from '@vue/test-utils';
import createStore from '@/store';
import MainWindow from '@/components/main-window';
import Mutation from '../../../../../src/renderer/store/mutation-types';

describe('MainWindow.vue', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('should contain a request editor', () => {
    const component = shallowMount(MainWindow, { store });

    expect(component.find({ name: 'RequestEditor' }).exists()).to.equal(true);
  });
  it('should contain a response inspector', () => {
    const component = shallowMount(MainWindow, { store });

    expect(component.find({ name: 'ResponseInspector' }).exists()).to.equal(true);
  });
  context('when an unexpected error occurred', () => {
    it('should render an error message component', () => {
      store.commit(Mutation.SET_ERROR_MESSAGE, 'error occurred');
      const component = shallowMount(MainWindow, { store });

      expect(component.find({ name: 'ErrorMessage' }).exists()).to.equal(true);
    });
  });
});
