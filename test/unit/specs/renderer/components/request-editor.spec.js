import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import RequestEditor from '@/components/request-editor';
import createStore from '@/store';
import Mutation from '@/store/mutation-types';
import HttpMethod from '../../../../../src/common/method-types';

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

  it('should disable editing by default', () => {
    const component = shallowMount(RequestEditor, { store });

    expect(component.find('#body-editor').element.disabled).to.equal(true);
    expect(component.find('#body-editor').element.checked).to.equal(false);
  });

  it('should enable request body editing when request method is POST', async () => {
    store.commit(Mutation.SELECT_HTTP_METHOD, HttpMethod.POST);
    await Vue.nextTick();

    const component = shallowMount(RequestEditor, { store });

    expect(component.find('#body-editor').element.disabled).to.equal(false);
    expect(component.find('#body-editor').element.checked).to.equal(true);
  });
});
