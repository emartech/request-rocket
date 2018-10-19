import createStore from '@/store';
import { shallowMount } from '@vue/test-utils';
import ResponseInspector from '@/components/response-inspector';
import Mutation from '@/store/mutation-types';
import Vue from 'vue';

describe('ResponseInspector.vue', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('should render a code editor component with the body contents', async () => {
    const ipcResponse = {
      body: '{"dummy":"content"}',
      headers: { 'content-type': 'text/plain' }
    };

    store.commit(Mutation.UPDATE_RESPONSE, ipcResponse);
    await Vue.nextTick();

    const component = shallowMount(ResponseInspector, { store });
    const codemirrorComponent = component.find({ name: 'CodeEditor' });

    expect(codemirrorComponent.props('code')).to.equal('{"dummy":"content"}');
  });

  it('should render a codemirror component with mode set to response type', async () => {
    const ipcResponse = {
      body: '{"dummy":"content"}',
      headers: { 'content-type': 'text/plain' }
    };

    store.commit(Mutation.UPDATE_RESPONSE, ipcResponse);
    await Vue.nextTick();

    const component = shallowMount(ResponseInspector, { store });
    const codemirrorComponent = component.find({ name: 'CodeEditor' });

    expect(codemirrorComponent.props('type')).to.equal('text/plain');
  });

  it('should render a codemirror component with read-only set to true', () => {
    store.commit(Mutation.UPDATE_RESPONSE, { status: 200 });

    const component = shallowMount(ResponseInspector, { store });
    const codemirrorComponent = component.find({ name: 'CodeEditor' });

    expect(codemirrorComponent.props('readOnly')).to.equal(true);
  });

  it('should render correct response status code', () => {
    const response = { status: 200 };

    store.commit(Mutation.UPDATE_RESPONSE, response);

    const component = shallowMount(ResponseInspector, { store });
    const statusPanelComponent = component.find({ name: 'StatusPanel' });

    expect(statusPanelComponent.exists()).to.equal(true);
  });

  it('should render a header inspector with the request headers', () => {
    const response = { status: 200 };
    const requestHeaders = { accept: 'text/plain' };

    store.commit(Mutation.UPDATE_RESPONSE, response);
    store.commit(Mutation.SET_SENT_REQUEST_HEADERS, requestHeaders);

    const component = shallowMount(ResponseInspector, { store });
    const headerInspector = component.find('#request-header-inspector');

    expect(headerInspector.props('headers')).to.eql({ accept: 'text/plain' });
  });

  it('should render a header inspector with the response headers', async () => {
    const ipcResponse = { headers: { 'content-type': 'text/plain' } };

    store.commit(Mutation.UPDATE_RESPONSE, ipcResponse);
    await Vue.nextTick();

    const component = shallowMount(ResponseInspector, { store });
    const headerInspector = component.find('#response-header-inspector');

    expect(headerInspector.props('headers')).to.eql({ 'content-type': 'text/plain' });
  });

  describe('#beutifyBody', () => {
    it('should return the same body when content type is not application/json', async () => {
      const ipcResponse = {
        body: '"dummy"',
        headers: { 'content-type': 'text/plain' }
      };

      store.commit(Mutation.UPDATE_RESPONSE, ipcResponse);
      await Vue.nextTick();

      const component = shallowMount(ResponseInspector, { store });
      const codemirrorComponent = component.find({ name: 'CodeEditor' });

      expect(codemirrorComponent.props('code')).to.equal('"dummy"');
    });

    it('should beautify json when content type is application/json', async () => {
      const ipcResponse = {
        body: '{"dummy":"content"}',
        headers: { 'content-type': 'application/json' }
      };

      store.commit(Mutation.UPDATE_RESPONSE, ipcResponse);
      await Vue.nextTick();

      const component = shallowMount(ResponseInspector, { store });
      const codemirrorComponent = component.find({ name: 'CodeEditor' });

      expect(codemirrorComponent.props('code')).to.equal('{\n  "dummy": "content"\n}');
    });

    it('should return the same body when json is invalid', async () => {
      const ipcResponse = {
        body: '{"dummy"}',
        headers: { 'content-type': 'application/json' }
      };

      store.commit(Mutation.UPDATE_RESPONSE, ipcResponse);
      await Vue.nextTick();

      const component = shallowMount(ResponseInspector, { store });
      const codemirrorComponent = component.find({ name: 'CodeEditor' });

      expect(codemirrorComponent.props('code')).to.equal('{"dummy"}');
    });
  });

  context('when no request was sent', () => {
    it('should display an empty state', () => {
      const component = shallowMount(ResponseInspector, { store });
      const emptyStateComponent = component.find({ name: 'EmptyState' });
      const responseDetailsElement = component.find('#response-details');

      expect(emptyStateComponent.exists()).to.equal(true);
      expect(responseDetailsElement.exists()).to.equal(false);
    });
  });
});
