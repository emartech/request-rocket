import createStore from '@/store';
import { shallowMount } from '@vue/test-utils';
import ResponseHeaders from '@/components/response-headers';
import Mutation from '@/store/mutation-types';
import Vue from 'vue';

describe('RequestHeaders.vue', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('should render correct response header contents', async () => {
    store.commit(Mutation.UPDATE_RESPONSE, { headers: { 'x-some-header': 'some_value' } });
    await Vue.nextTick();
    const component = shallowMount(ResponseHeaders, { store });
    const headersElement = component.find('pre#response-headers');
    const expectedHeaders = JSON.parse(headersElement.element.textContent);
    expect(expectedHeaders).to.eql({ 'x-some-header': 'some_value' });
  });
});
