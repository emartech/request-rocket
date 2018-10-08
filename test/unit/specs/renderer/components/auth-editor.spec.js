import { mount } from '@vue/test-utils';
import AuthEditor from '@/components/auth-editor';
import createStore from '@/store';

describe('AuthEditor.vue', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('should render selector for auth types', async () => {
    const component = mount(AuthEditor, { store });

    const selectElement = component.find('select.auth-type');
    store.state.auth.types.forEach(auth => {
      expect(selectElement.find(`option[value="${auth.type}"]`).element.textContent).to.equal(auth.label);
    });
  });
});
