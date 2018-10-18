import { shallowMount } from '@vue/test-utils';
import RequestEditor from '@/components/request-editor';
import createStore from '@/store';

describe('RequestEditor.vue', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('should contain an URL group', () => {
    const component = shallowMount(RequestEditor, { store });

    expect(component.find({ name: 'UrlGroup' }).exists()).to.eql(true);
  });

  it('should contain an auth editor', () => {
    const component = shallowMount(RequestEditor, { store });

    expect(component.find({ name: 'AuthEditor' }).exists()).to.eql(true);
  });

  it('should render request header editor', () => {
    const component = shallowMount(RequestEditor, { store });
    const headerEditor = component.find({ name: 'HeaderEditor' });

    expect(headerEditor.exists()).to.eql(true);
  });

  it('should render request body editor', () => {
    const component = shallowMount(RequestEditor, { store });
    const bodyEditor = component.find({ name: 'RequestBodyEditor' });

    expect(bodyEditor.exists()).to.eql(true);
  });
});
