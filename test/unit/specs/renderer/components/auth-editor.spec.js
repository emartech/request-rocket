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
    expect(selectElement.find('select.auth-type > option[value="none"]').element.textContent).to.equal('none');
    expect(selectElement.find('select.auth-type > option[value="wsse"]').element.textContent).to.equal('WSSE');
  });
});
