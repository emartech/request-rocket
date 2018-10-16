import Vue from 'vue';
import Vuex from 'vuex';
import sinon from 'sinon';
import { shallowMount } from '@vue/test-utils';
import RequestEditor from '@/components/request-editor';
import createStore from '@/store';
import Action from '@/store/action-types';
import Mutation from '@/store/mutation-types';
import Getters from '../../../../../src/renderer/store/getters';
import HttpMethod from '../../../../../src/common/method-types';
import ContentType from '../../../../../src/common/content-types';

describe('RequestEditor.vue', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('should render correct contents', async () => {
    store.commit(Mutation.UPDATE_URL, 'https://some.url');
    await Vue.nextTick();
    const component = shallowMount(RequestEditor, { store });

    expect(component.find('#request-editor-url-field').element.value).to.equal('https://some.url');
  });

  context('editing the URL content', () => {
    it('should set the URL in the store', () => {
      const component = shallowMount(RequestEditor, { store });

      const input = component.find('#request-editor-url-field');

      input.element.value = 'https://new.url';
      input.trigger('input');

      expect(store.state.request.url).to.equal('https://new.url');
    });
  });

  context('clicking the send button', () => {
    context('when network is online', () => {
      it('should dispatch the request', () => {
        const requestSender = sinon.spy();

        const store = new Vuex.Store({
          state: {
            networkStatus: 'online',
            request: {}
          },
          getters: Getters,
          actions: {
            [Action.sendRequest]: requestSender
          }
        });

        const component = shallowMount(RequestEditor, { store });

        const button = component.find('#request-editor-send-button');

        button.trigger('click');

        expect(requestSender.calledOnce).to.eql(true);
      });
    });

    context('when network is offline', () => {
      it('should not send a request', () => {
        const requestSender = sinon.spy();

        const store = new Vuex.Store({
          state: {
            networkStatus: 'offline',
            request: {}
          },
          getters: Getters,
          actions: { [Action.sendRequest]: requestSender }
        });

        const component = shallowMount(RequestEditor, { store });
        const button = component.find('#request-editor-send-button');

        button.trigger('click');

        expect(requestSender.calledOnce).to.eql(false);
      });
    });
  });

  it('should contain an auth editor', () => {
    const component = shallowMount(RequestEditor, { store });

    expect(component.find({ name: 'AuthEditor' }).exists()).to.eql(true);
  });

  it('should render selector for http method options', () => {
    const component = shallowMount(RequestEditor, { store });
    const selectElement = component.find('select.http-method');

    store.state.request.httpMethodOptions.forEach(option => {
      expect(selectElement.find(`option[value="${option.id}"]`).text()).to.equal(option.label);
    });
  });

  it('should set the selected http method on the store', () => {
    const component = shallowMount(RequestEditor, { store });
    const select = component.find('select.http-method');
    select.element.value = HttpMethod.POST;
    select.trigger('change');

    expect(store.state.request.method).to.equal(HttpMethod.POST);
  });

  it('should hide request body editor by default', () => {
    const component = shallowMount(RequestEditor, { store });

    expect(component.find({ name: 'CodeEditor' }).element).to.eql(undefined);
  });

  it('should show request body editor when request method is POST', async () => {
    store.commit(Mutation.SELECT_HTTP_METHOD, HttpMethod.POST);
    await Vue.nextTick();

    const component = shallowMount(RequestEditor, { store });

    expect(component.find({ name: 'CodeEditor' }).element).not.to.eql(undefined);
  });

  it('should set request body on the store', async () => {
    store.commit(Mutation.SELECT_HTTP_METHOD, HttpMethod.POST);
    await Vue.nextTick();

    const component = shallowMount(RequestEditor, { store });
    const codeEditor = component.find({ name: 'CodeEditor' });
    codeEditor.vm.$emit('input', '{"foo":"bar}');

    expect(store.state.request.body).to.equal('{"foo":"bar}');
  });

  it('should send code content to code editor in props', async () => {
    store.commit(Mutation.SELECT_HTTP_METHOD, HttpMethod.POST);
    store.commit(Mutation.SET_REQUEST_BODY, '{"hello":"bello"}');
    await Vue.nextTick();

    const component = shallowMount(RequestEditor, { store });
    const codemirrorComponent = component.find({ name: 'CodeEditor' });

    expect(codemirrorComponent.props('code')).to.equal('{"hello":"bello"}');
  });

  it('should hide content type selector by default', () => {
    const component = shallowMount(RequestEditor, { store });
    const contentTypeSelector = component.find({ name: 'ContentTypeSelector' });

    expect(contentTypeSelector.exists()).to.eql(false);
  });
  it('should show content type selector when request method is POST', async () => {
    store.commit(Mutation.SELECT_HTTP_METHOD, HttpMethod.POST);
    await Vue.nextTick();

    const component = shallowMount(RequestEditor, { store });
    const contentTypeSelector = component.find({ name: 'ContentTypeSelector' });

    expect(contentTypeSelector.exists()).to.eql(true);
  });
  context('when content type is selected', () => {
    it('should set the code editors type property', async () => {
      store.commit(Mutation.SELECT_HTTP_METHOD, HttpMethod.POST);
      store.commit(Mutation.SELECT_CONTENT_TYPE, ContentType.json);
      await Vue.nextTick();

      const component = shallowMount(RequestEditor, { store });
      const codeEditor = component.find({ name: 'CodeEditor' });

      expect(codeEditor.props('type')).to.equal(ContentType.json);
    });
  });
});
