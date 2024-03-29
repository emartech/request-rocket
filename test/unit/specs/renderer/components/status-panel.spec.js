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

  it('should render the status text tooltip', () => {
    const response = { status: 200, body: '' };
    store.commit(Mutation.UPDATE_RESPONSE, response);

    const component = shallowMount(StatusPanel, { store });
    const statusCodeElement = component.find('#status-text');

    expect(statusCodeElement.exists()).to.eql(true);
    expect(statusCodeElement.attributes('content')).to.eql('OK');
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
    const response = { status: 200, elapsedTime: 100, body: '' };
    store.commit(Mutation.UPDATE_RESPONSE, response);

    const component = shallowMount(StatusPanel, { store });
    const elapsedTimeElement = component.find('#request-time');

    expect(elapsedTimeElement.exists()).to.eql(true);
    expect(elapsedTimeElement.text()).to.eql('100ms');
  });

  it('should render the time in human readable format', () => {
    const response = { status: 200, elapsedTime: 1300, body: '' };
    store.commit(Mutation.UPDATE_RESPONSE, response);

    const component = shallowMount(StatusPanel, { store });
    const elapsedTimeElement = component.find('#request-time');

    expect(elapsedTimeElement.text()).to.eql('1.3s');
  });

  it('should render the response size', () => {
    const response = { status: 200, body: 'abcd' };
    store.commit(Mutation.UPDATE_RESPONSE, response);

    const component = shallowMount(StatusPanel, { store });
    const elapsedTimeElement = component.find('#response-size');

    expect(elapsedTimeElement.exists()).to.eql(true);
    expect(elapsedTimeElement.text()).to.eql('4 B');
  });

  it('should display size in a human readable format', () => {
    const response = { status: 200, body: '#'.repeat(1337) };
    store.commit(Mutation.UPDATE_RESPONSE, response);

    const component = shallowMount(StatusPanel, { store });
    const elapsedTimeElement = component.find('#response-size');

    expect(elapsedTimeElement.text()).to.eql('1.34 kB');
  });
});
