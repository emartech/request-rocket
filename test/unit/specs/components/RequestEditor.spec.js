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
});
