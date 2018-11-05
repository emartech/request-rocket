import Vue from 'vue';
import sinon from 'sinon';
import { shallowMount } from '@vue/test-utils';
import UrlGroup from '@/components/url-group';
import createStore from '@/store';
import Action from '@/store/action-types';
import Mutation from '@/store/mutation-types';
import httpMethodOptions from '../../../../../src/renderer/store/method-options';
import HttpMethod from '../../../../../src/common/method-types';

describe('UrlGroup.vue', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('should render correct contents', async () => {
    store.commit(Mutation.UPDATE_URL, 'https://some.url');
    await Vue.nextTick();
    const component = shallowMount(UrlGroup, { store });

    expect(component.find('#request-editor-url-field').element.value).to.equal('https://some.url');
  });

  context('editing the URL content', () => {
    it('should set the URL in the store', () => {
      const component = shallowMount(UrlGroup, { store });

      const input = component.find('#request-editor-url-field');

      input.element.value = 'https://new.url';
      input.trigger('input');

      expect(store.state.request.url).to.equal('https://new.url');
    });
  });

  context('clicking the send button', () => {
    context('when network is online', () => {
      it('should dispatch the request', () => {
        const dispatchSpy = sinon.spy(store, 'dispatch');
        const component = shallowMount(UrlGroup, { store });
        const button = component.find('#request-editor-send-button');

        button.trigger('click');

        expect(dispatchSpy).to.be.calledWith(Action.sendRequest);
      });
    });

    context('when network is offline', () => {
      it('should not send a request', () => {
        store.commit(Mutation.UPDATE_NETWORK_STATUS, 'offline');

        const dispatchSpy = sinon.spy(store, 'dispatch');
        const component = shallowMount(UrlGroup, { store });
        const button = component.find('#request-editor-send-button');

        button.trigger('click');

        expect(dispatchSpy.called).to.equal(false);
      });
    });
  });

  context('pressing enter in the URL field', () => {
    context('when network is online', () => {
      it('should dispatch the request', () => {
        const dispatchSpy = sinon.spy(store, 'dispatch');
        const component = shallowMount(UrlGroup, { store });
        const urlField = component.find('#request-editor-url-field');

        urlField.trigger('keyup.enter');

        expect(dispatchSpy).to.be.calledWith(Action.sendRequest);
      });
    });

    context('when network is offline', () => {
      it('should not send a request', () => {
        store.commit(Mutation.UPDATE_NETWORK_STATUS, 'offline');

        const dispatchSpy = sinon.spy(store, 'dispatch');
        const component = shallowMount(UrlGroup, { store });
        const urlField = component.find('#request-editor-url-field');

        urlField.trigger('keyup.enter');

        expect(dispatchSpy.called).to.equal(false);
      });
    });
  });

  it('should render selector for http method options', () => {
    const component = shallowMount(UrlGroup, { store });
    const selectElement = component.find('select.http-method');

    httpMethodOptions.forEach(option => {
      expect(selectElement.find(`option[value="${option.id}"]`).text()).to.equal(option.label);
    });
  });

  it('should set the selected http method on the store', () => {
    const component = shallowMount(UrlGroup, { store });
    const select = component.find('select.http-method');
    select.element.value = HttpMethod.POST;
    select.trigger('change');

    expect(store.state.request.method).to.equal(HttpMethod.POST);
  });
});
