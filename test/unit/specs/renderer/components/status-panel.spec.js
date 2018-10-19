import { shallowMount } from '@vue/test-utils';
import StatusPanel from '@/components/status-panel';
import createStore from '@/store';
import Mutation from '../../../../../src/renderer/store/mutation-types';

describe('RequestEditorTitle.vue', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('should render the status code', () => {
    const response = { status: 200 };
    store.commit(Mutation.UPDATE_RESPONSE, response);

    const component = shallowMount(StatusPanel, { store });
    const statusCodeElement = component.find('#status-code');

    expect(statusCodeElement.exists()).to.eql(true);
    expect(statusCodeElement.text()).to.eql('200');
  });

  it('should render the request round trip time', () => {
    const response = { elapsedTime: 100 };
    store.commit(Mutation.UPDATE_RESPONSE, response);

    const component = shallowMount(StatusPanel, { store });
    const elapsedTimeElement = component.find('#request-time');

    expect(elapsedTimeElement.exists()).to.eql(true);
    expect(elapsedTimeElement.text()).to.eql('100 ms');
  });
});
