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
    store.commit(Mutation.SET_SENT_REQUEST_HEADERS, {
      'x-some-header1': 'some_value1',
      'x-some-header2': 'some_value2'
    });

    await Vue.nextTick();

    const component = shallowMount(RequestHeaders, { store });

    const expectedHeaders = ['x-some-header1: some_value1', 'x-some-header2: some_value2'];

    const actualHeaders = component
      .find('#request-headers')
      .text()
      .split('\n');

    actualHeaders.forEach((headerAsText, index) => {
      expect(expectedHeaders[index]).to.eql(headerAsText.trim());
    });
  });
});
