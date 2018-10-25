import { shallowMount } from '@vue/test-utils';
import StatusPanel from '@/components/status-panel';
import createStore from '@/store';
import Mutation from '../../../../../src/renderer/store/mutation-types';

describe('StatusPanel.vue', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('should render the status code', () => {
    const response = { status: 200, body: '' };
    store.commit(Mutation.UPDATE_RESPONSE, response);

    const component = shallowMount(StatusPanel, { store });
    const statusCodeElement = component.find('#status-code');

    expect(statusCodeElement.exists()).to.eql(true);
    expect(statusCodeElement.text()).to.eql('200');
  });

  context('when status code indicates failure', () => {
    it('should set the style to text-color-danger', () => {
      const response = { status: 400, body: '' };
      store.commit(Mutation.UPDATE_RESPONSE, response);

      const component = shallowMount(StatusPanel, { store });
      const statusCodeElement = component.find('#status-code');

      expect(statusCodeElement.classes()).to.include('text-color-danger');
    });
  });

  context('when status code indicates success', () => {
    it('should set the style to text-color-success', () => {
      const response = { status: 200, body: '' };
      store.commit(Mutation.UPDATE_RESPONSE, response);

      const component = shallowMount(StatusPanel, { store });
      const statusCodeElement = component.find('#status-code');

      expect(statusCodeElement.classes()).to.include('text-color-success');
    });
  });

  it('should render the request round trip time', () => {
    const response = { elapsedTime: 100, body: '' };
    store.commit(Mutation.UPDATE_RESPONSE, response);

    const component = shallowMount(StatusPanel, { store });
    const elapsedTimeElement = component.find('#request-time');

    expect(elapsedTimeElement.exists()).to.eql(true);
    expect(elapsedTimeElement.text()).to.eql('100 ms');
  });

  it('should render the response size', () => {
    const response = { body: 'abcd' };
    store.commit(Mutation.UPDATE_RESPONSE, response);

    const component = shallowMount(StatusPanel, { store });
    const elapsedTimeElement = component.find('#response-size');

    expect(elapsedTimeElement.exists()).to.eql(true);
    expect(elapsedTimeElement.text()).to.eql('4 B');
  });
});
