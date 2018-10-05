import createStore from '@/store';
import { mount } from '@vue/test-utils';
import ResponseInspector from '@/components/response-inspector';
import Mutation from '@/store/mutation-types';
import Vue from 'vue';

const chai = require('chai');
chai.use(require('chai-json'));

describe('ResponseInspector.vue', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('should render correct contents', async () => {
    store.commit(Mutation.UPDATE_RESPONSE, { body: '{"dummy":"content"}' });
    await Vue.nextTick();
    const component = mount(ResponseInspector, { store });

    expect(component.find('pre#response-body').element.textContent).to.equal('{"dummy":"content"}');
  });
});
