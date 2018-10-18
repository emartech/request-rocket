import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import RequestBodyEditor from '@/components/request-body-editor';
import createStore from '@/store';
import Mutation from '@/store/mutation-types';
import HttpMethod from '../../../../../src/common/method-types';
import ContentType from '../../../../../src/common/content-types';

describe('RequestEditor.vue', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('should hide request body editor by default', () => {
    const component = shallowMount(RequestBodyEditor, { store });

    expect(component.find({ name: 'CodeEditor' }).element).to.eql(undefined);
  });

  it('should show request body editor when request method is POST', async () => {
    store.commit(Mutation.SELECT_HTTP_METHOD, HttpMethod.POST);
    await Vue.nextTick();

    const component = shallowMount(RequestBodyEditor, { store });

    expect(component.find({ name: 'CodeEditor' }).element).not.to.eql(undefined);
  });

  it('should set request body on the store', async () => {
    store.commit(Mutation.SELECT_HTTP_METHOD, HttpMethod.POST);
    await Vue.nextTick();

    const component = shallowMount(RequestBodyEditor, { store });
    const codeEditor = component.find({ name: 'CodeEditor' });
    codeEditor.vm.$emit('input', '{"foo":"bar}');

    expect(store.state.request.body).to.equal('{"foo":"bar}');
  });

  it('should send code content to code editor in props', async () => {
    store.commit(Mutation.SELECT_HTTP_METHOD, HttpMethod.POST);
    store.commit(Mutation.SET_REQUEST_BODY, '{"hello":"bello"}');
    await Vue.nextTick();

    const component = shallowMount(RequestBodyEditor, { store });
    const codemirrorComponent = component.find({ name: 'CodeEditor' });

    expect(codemirrorComponent.props('code')).to.equal('{"hello":"bello"}');
  });

  it('should hide content type selector by default', () => {
    const component = shallowMount(RequestBodyEditor, { store });
    const contentTypeSelector = component.find({ name: 'ContentTypeSelector' });

    expect(contentTypeSelector.exists()).to.eql(false);
  });

  it('should show content type selector when request method is POST', async () => {
    store.commit(Mutation.SELECT_HTTP_METHOD, HttpMethod.POST);
    await Vue.nextTick();

    const component = shallowMount(RequestBodyEditor, { store });
    const contentTypeSelector = component.find({ name: 'ContentTypeSelector' });

    expect(contentTypeSelector.exists()).to.eql(true);
  });

  context('when content type is selected', () => {
    it('should set the code editors type property', async () => {
      store.commit(Mutation.SELECT_HTTP_METHOD, HttpMethod.POST);
      store.commit(Mutation.SELECT_CONTENT_TYPE, ContentType.json);
      await Vue.nextTick();

      const component = shallowMount(RequestBodyEditor, { store });
      const codeEditor = component.find({ name: 'CodeEditor' });

      expect(codeEditor.props('type')).to.equal(ContentType.json);
    });
  });
});
