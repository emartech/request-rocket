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

  it('should render correct body contents', async () => {
    const ipcResponse = {
      body: { dummy: 'content' },
      headers: { connection: 'close' }
    };
    store.commit(Mutation.UPDATE_RESPONSE, ipcResponse);
    await Vue.nextTick();
    const component = shallowMount(ResponseInspector, { store });
    const bodyElement = component.find('pre#response-body');
    const expectedBody = JSON.parse(bodyElement.element.textContent);
    expect(expectedBody).to.eql(ipcResponse.body);
  });

  it('should render correct header contents', async () => {
    const ipcResponse = {
      body: { dummy: 'content' },
      headers: { connection: 'close' }
    };
    store.commit(Mutation.UPDATE_RESPONSE, ipcResponse);
    await Vue.nextTick();
    const component = shallowMount(ResponseInspector, { store });
    const headersElement = component.find('pre#response-headers');
    const expectedHeaders = JSON.parse(headersElement.element.textContent);
    expect(expectedHeaders).to.eql(ipcResponse.headers);
  });
});
