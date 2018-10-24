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
    const select = component.find('select.auth-type');
    select.element.value = Auth.WSSE;
    select.trigger('change');

    expect(store.state.auth.selected).to.equal(Auth.WSSE);
  });

  context('when WSSE auth is selected', () => {
    it('should contain a WSSE editor', () => {
      const select = component.find('select.auth-type');
      select.element.value = Auth.WSSE;
      select.trigger('change');

      expect(component.find({ name: 'WsseEditor' }).exists()).to.eql(true);
    });
  });

  context('when no auth was selected', () => {
    it('should not contain a WSSE editor', () => {
      const select = component.find('select.auth-type');
      select.element.value = Auth.NONE;
      select.trigger('change');

      expect(component.find({ name: 'WsseEditor' }).exists()).to.eql(false);
    });
    it('should not contain a Escher editor', () => {
      const select = component.find('select.auth-type');
      select.element.value = Auth.NONE;
      select.trigger('change');

      expect(component.find({ name: 'EscherEditor' }).exists()).to.eql(false);
    });
  });

  context('when Escher auth is selected', () => {
    it('should contain a Escher editor', () => {
      const select = component.find('select.auth-type');
      select.element.value = Auth.ESCHER;
      select.trigger('change');

      expect(component.find({ name: 'EscherEditor' }).exists()).to.eql(true);
    });
  });
});
