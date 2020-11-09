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
    it('should dispatch the request', () => {
      const dispatchSpy = sinon.spy(store, 'dispatch');
      const component = shallowMount(UrlGroup, { store });
      const button = component.find('#request-editor-send-button');

      button.trigger('click');

      expect(dispatchSpy).to.be.calledWith(Action.sendRequest);
    });
  });

  context('pressing enter in the URL field', () => {
    it('should dispatch the request', () => {
      const dispatchSpy = sinon.spy(store, 'dispatch');
      const component = shallowMount(UrlGroup, { store });
      const urlField = component.find('#request-editor-url-field');

      urlField.trigger('keyup.enter');

      expect(dispatchSpy).to.be.calledWith(Action.sendRequest);
    });
  });

  it('should render selector for http method options', () => {
    const component = shallowMount(UrlGroup, { store });
    const selectElement = component.find('[data-test=method-selector]');

    httpMethodOptions.forEach(option => {
      expect(selectElement.find(`e-select-option[value="${option.id}"]`).text()).to.equal(option.label);
    });
  });

  it('should set the selected http method on the store', () => {
    const component = shallowMount(UrlGroup, { store });
    const select = component.find('[data-test=method-selector]');
    select.element.value = HttpMethod.POST;
    select.trigger('change');

    expect(store.state.request.method).to.equal(HttpMethod.POST);
  });

  context('URL tooltip', () => {
    it('should be disabled if the URL is empty', () => {
      store.commit(Mutation.UPDATE_URL, '');
      const component = shallowMount(UrlGroup, { store });
      const tooltip = component.find('#request-editor-url-tooltip');

      expect(tooltip.attributes('disabled')).to.equal('true');
    });

    it('should be enabled if there is an URL', () => {
      store.commit(Mutation.UPDATE_URL, 'https://some.url');
      const component = shallowMount(UrlGroup, { store });
      const tooltip = component.find('#request-editor-url-tooltip');

      expect(tooltip.attributes('disabled')).to.equal(undefined);
    });

    it('should display the URL', () => {
      store.commit(Mutation.UPDATE_URL, 'https://some.url');
      const component = shallowMount(UrlGroup, { store });
      const tooltip = component.find('#request-editor-url-tooltip');

      expect(tooltip.attributes('content')).to.equal('https://some.url');
    });

    it('should break long URLs into multiple lines', () => {
      store.commit(
        Mutation.UPDATE_URL,
        'ta6halm28uxk865bapjsvkv1wuwf4qvd5koye5cgw07go142e65klibj8kyh3fmpj049ojy9fugbg7gfp40npnlkdvcqyj4flva64v1acesenvl8ff2rsp9i9v00884t4l05vzgc9b70dj19nm2x8t2pokdq62svqozjx4es14ecfrqdo23sq95g5mc1av0ql1gx7ojwr1fi3xvnybkgh80h2r46uugs74icx1gupk3x5519ji2pkieu3f'
      );
      const component = shallowMount(UrlGroup, { store });
      const tooltip = component.find('#request-editor-url-tooltip');

      tooltip
        .attributes('content')
        .split('<br>')
        .forEach(line => {
          expect(line).to.have.lengthOf.at.most(100);
        });
    });
  });
});
