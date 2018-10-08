import { shallowMount } from '@vue/test-utils';
import AuthEditor from '@/components/auth-editor';
import createStore from '@/store';
import Auth from '../../../../../src/common/auth-types';

describe('AuthEditor.vue', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('should render selector for auth types', () => {
    const component = shallowMount(AuthEditor, { store });

    const selectElement = component.find('select.auth-type');
    store.getters.authTypes.forEach(auth => {
      expect(selectElement.find(`option[value="${auth.id}"]`).element.textContent).to.equal(auth.label);
    });
  });

  it('should set the selected auth type on the store', () => {
    const wsseOption = store.getters.authTypes.find(auth => auth.id === Auth.wsse);
    const component = shallowMount(AuthEditor, { store });

    const select = component.find('select.auth-type');
    select.element.value = wsseOption.id;
    select.trigger('input');

    expect(store.state.auth.selected).to.equal(wsseOption);
  });
});
