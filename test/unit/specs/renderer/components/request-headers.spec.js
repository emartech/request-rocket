import createStore from '@/store';
import { shallowMount } from '@vue/test-utils';
import RequestHeaders from '@/components/request-headers';
import Mutation from '@/store/mutation-types';
import Vue from 'vue';

describe('RequestHeaders.vue', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('should render correct request header contents', async () => {
    store.commit(Mutation.SET_SENT_REQUEST_HEADERS, { 'x-some-header': 'some_value' });
    await Vue.nextTick();
    const component = shallowMount(RequestHeaders, { store });
    const headersElement = component.find('pre#request-headers');
    const expectedHeaders = JSON.parse(headersElement.element.textContent);
    expect(expectedHeaders).to.eql({ 'x-some-header': 'some_value' });
  });
});
