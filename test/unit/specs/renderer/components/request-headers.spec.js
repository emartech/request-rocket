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
    const component = shallowMount(RequestHeaders, { store });

    store.commit(Mutation.SET_SENT_REQUEST_HEADERS, {
      'x-some-header1': 'some_value1',
      'x-some-header2': 'some_value2'
    });
    await Vue.nextTick();

    const displayedHeaders = component.find('#request-headers').text();

    expect(displayedHeaders).to.match(/^\s*x-some-header1:\s+some_value1\n\s*x-some-header2:\s+some_value2\s*$/);
  });
});
