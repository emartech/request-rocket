import { shallowMount } from '@vue/test-utils';
import createStore from '@/store';
import EscherEditor from '@/components/escher-editor';

describe('EscherEditor.vue', () => {
  let component;
  let store;

  beforeEach(() => {
    store = createStore();
    component = shallowMount(EscherEditor, { store });
  });

  it('should render inputs for key, secret and credential scope', () => {
    expect(component.find('#escher-key').exists()).to.eql(true);
    expect(component.find('#escher-secret').exists()).to.eql(true);
    expect(component.find('#credential-scope').exists()).to.eql(true);
  });

  it('should set the credentials on the store', () => {
    const key = component.find('#escher-key');
    key.element.value = 'some_key_name';
    key.trigger('input');

    const secret = component.find('#escher-secret');
    secret.element.value = 'v3ry53cr3t';
    secret.trigger('input');

    const credentialScope = component.find('#credential-scope');
    credentialScope.element.value = 'some/credential/scope';
    credentialScope.trigger('input');

    expect(store.state.auth.params).to.eql({
      key: 'some_key_name',
      secret: 'v3ry53cr3t',
      credentialScope: 'some/credential/scope'
    });
  });
});
