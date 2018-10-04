import Vue from 'vue';
import { mount } from '@vue/test-utils';
import RequestEditor from '@/components/RequestEditor';
import createStore from '@/store';


describe('RequestEditor.vue', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('should render correct contents', async () => {
    store.commit('UPDATE_URL', 'https://some.url');
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
});
