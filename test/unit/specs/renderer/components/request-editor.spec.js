import Vue from 'vue';
import Vuex from 'vuex';
import sinon from 'sinon';
import { mount } from '@vue/test-utils';
import RequestEditor from '@/components/request-editor';
import createStore from '@/store';
import Action from '@/store/action-types';
import Mutation from '@/store/mutation-types';


describe('RequestEditor.vue', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('should render correct contents', async () => {
    store.commit(Mutation.UPDATE_URL, 'https://some.url');
    await Vue.nextTick();
    const component = mount(RequestEditor, { store });

    expect(component.find('#request-editor-url-field').element.value).to.equal('https://some.url');
  });
  context('editing the URL content', () => {
    it('should set the URL in the store', () => {
      const component = mount(RequestEditor, { store });

      const input = component.find('#request-editor-url-field');

      input.element.value = 'https://new.url';
      input.trigger('input');

      expect(store.state.url).to.equal('https://new.url');
    });
  });
  context('clicking the send button', () => {
    it('should dispatch the request', () => {
      const requestSender = sinon.spy();

      const store = new Vuex.Store({
        actions: {
          [Action.sendRequest]: requestSender,
        },
      });

      const component = mount(RequestEditor, { store });

      const input = component.find('#request-editor-send-button');

      input.trigger('click');

      expect(requestSender.calledOnce).to.eql(true);
    });
  });
});
