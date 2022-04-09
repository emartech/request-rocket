import { shallowMount } from '@vue/test-utils';
import createStore from '@/store';
import MainWindow from '@/components/main-window';

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
  it('should contain an error message component', () => {
    const component = shallowMount(MainWindow, { store });

    expect(component.find({ name: 'ErrorMessage' }).exists()).to.equal(true);
  });

  it('should contain an info message component', () => {
    const component = shallowMount(MainWindow, { store });

    expect(component.find({ name: 'InfoMessage' }).exists()).to.equal(true);
  });
});
