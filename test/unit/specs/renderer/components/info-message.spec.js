import { shallowMount } from '@vue/test-utils';
import Vue from 'vue';
import InfoMessage from '@/components/info-message';
import createStore from '@/store';
import sinon from 'sinon';
import Mutation from '../../../../../src/renderer/store/mutation-types';

describe('InfoMessage.vue', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('should render the info message', async () => {
    const component = shallowMount(InfoMessage, { store });

    store.commit(Mutation.ADD_INFO_MESSAGE, 'retek');

    await Vue.nextTick();

    const infoMessage = component.find('#info-message');

    expect(infoMessage.exists()).to.eql(true);
    expect(infoMessage.text()).to.eql('retek');
  });

  context('after 5 seconds pass', () => {
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should clear info message', () => {
      const component = shallowMount(InfoMessage, { store });

      store.commit(Mutation.ADD_INFO_MESSAGE, 'csira');

      clock.tick(5000);

      const infoMessage = component.find('#info-message');

      expect(infoMessage.exists()).to.eql(false);
    });
  });
});
