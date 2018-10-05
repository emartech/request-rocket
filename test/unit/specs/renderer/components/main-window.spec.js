import { shallowMount } from '@vue/test-utils';
import MainWindow from '@/components/main-window';

describe('MainWindow.vue', () => {
  it('should render correct contents', async () => {
    const component = shallowMount(MainWindow, {});

    expect(component.find('.title').element.textContent).to.equal('Request Rocket');
  });
  it('should contain a request editor', async () => {
    const component = shallowMount(MainWindow, {});

    expect(component.find({ name: 'request-editor' }).exists()).to.eql(true);
  });
  it('should contain a response inspector', async () => {
    const component = shallowMount(MainWindow, {});

    expect(component.find({ name: 'response-inspector' }).exists()).to.eql(true);
  });
});
