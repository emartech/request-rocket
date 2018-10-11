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

  it('should render a codemirror component with the body contents', async () => {
    const ipcResponse = {
      body: "{ dummy: 'content' }",
      headers: { connection: 'close' }
    };
    store.commit(Mutation.UPDATE_RESPONSE, ipcResponse);
    await Vue.nextTick();
    const component = shallowMount(ResponseInspector, { store });
    const codemirrorComponent = component.find({ name: 'codemirror' });
    expect(codemirrorComponent.element.getAttribute('value')).to.equal("{ dummy: 'content' }");
  });

  it('should render correct response header contents', async () => {
    const ipcResponse = {
      body: "{ dummy: 'content' }",
      headers: { connection: 'close' }
    };
    store.commit(Mutation.UPDATE_RESPONSE, ipcResponse);
    await Vue.nextTick();
    const component = shallowMount(ResponseInspector, { store });
    const headersElement = component.find('pre#response-headers');
    const renderedHeaders = JSON.parse(headersElement.element.textContent);
    expect(renderedHeaders).to.eql(ipcResponse.headers);
  });

  it('should render correct response status code', async () => {
    const ipcResponse = {
      body: "{ dummy: 'content' }",
      headers: { connection: 'close' },
      status: 200
    };
    store.commit(Mutation.UPDATE_RESPONSE, ipcResponse);
    await Vue.nextTick();
    const component = shallowMount(ResponseInspector, { store });
    const statusCodeElement = component.find('span#status-code');
    const renderedStatusCode = statusCodeElement.element.textContent;
    expect(renderedStatusCode).to.eql('200');
  });

  it('should render correct request header contents', async () => {
    store.commit(Mutation.UPDATE_REQUEST_HEADERS, { 'x-some-header': 'some_value' });
    await Vue.nextTick();
    const component = shallowMount(ResponseInspector, { store });
    const headersElement = component.find('pre#request-headers');
    const expectedHeaders = JSON.parse(headersElement.element.textContent);
    expect(expectedHeaders).to.eql({ 'x-some-header': 'some_value' });
  });
});
