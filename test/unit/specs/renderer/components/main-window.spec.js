import { shallowMount } from '@vue/test-utils';
import MainWindow from '@/components/main-window';

describe('MainWindow.vue', () => {
  it('should render correct contents', () => {
    const component = shallowMount(MainWindow, {});

    expect(component.find('.title').element.textContent).to.equal('Request Rocket');
  });
  it('should contain a request editor', () => {
    const component = shallowMount(MainWindow, {});

    expect(component.find({ name: 'RequestEditor' }).exists()).to.eql(true);
  });
  it('should contain a response inspector', () => {
    const component = shallowMount(MainWindow, {});

    expect(component.find({ name: 'ResponseInspector' }).exists()).to.eql(true);
  });
});
