import { shallowMount } from '@vue/test-utils';
import AuthEditor from '@/components/auth-editor';
import createStore from '@/store';
import Auth from '../../../../../src/common/auth-types';
import AuthOptions from '../../../../../src/renderer/store/auth-options';

describe('AuthEditor.vue', () => {
  let component;
  let store;

  beforeEach(() => {
    store = createStore();
    component = shallowMount(AuthEditor, { store });
  });

  it('should render selector for auth types', () => {
    const selectElement = component.find('select.auth-type');
    AuthOptions.forEach(auth => {
      expect(selectElement.find(`option[value="${auth.id}"]`).element.textContent).to.equal(auth.label);
    });
  });

  it('should set the selected auth type on the store', () => {
    const wsseOption = AuthOptions.find(auth => auth.id === Auth.wsse);

    const select = component.find('select.auth-type');
    select.element.value = wsseOption.id;
    select.trigger('change');

    expect(store.state.auth.selected).to.equal(wsseOption);
  });
  context('when WSSE auth is selected', () => {
    beforeEach(() => {
      const wsseOption = AuthOptions.find(auth => auth.id === Auth.wsse);

      const select = component.find('select.auth-type');
      select.element.value = wsseOption.id;
      select.trigger('change');
    });

    it('should contain a WSSE editor', () => {
      expect(component.find({ name: 'WsseEditor' }).exists()).to.eql(true);
    });
  });
  context('when no auth was selected', () => {
    beforeEach(() => {
      const noneOption = AuthOptions.find(auth => auth.id === Auth.none);

      const select = component.find('select.auth-type');
      select.element.value = noneOption.id;
      select.trigger('change');
    });

    it('should not contain a WSSE editor', () => {
      expect(component.find({ name: 'WsseEditor' }).exists()).to.eql(false);
    });
  });
});
