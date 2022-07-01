import { shallowMount } from '@vue/test-utils';
import WsseEditor from '@/components/wsse-editor';
import createStore from '@/store';
import Mutation from '@/store/mutation-types';
import Vue from 'vue';

describe('WsseEditor.vue', () => {
  let component;
  let store;

  beforeEach(() => {
    store = createStore();
    component = shallowMount(WsseEditor, { store });
  });

  it('should render inputs for key and secret', () => {
    expect(component.find('#wsse-key').exists()).to.eql(true);
    expect(component.find('#wsse-secret').exists()).to.eql(true);
  });

  it('should populate key and secret from state', async () => {
    store.commit(Mutation.MERGE_AUTH_PARAMS, { key: 'myKey', secret: 'mySecret' });

    await Vue.nextTick();

    expect(component.find('#wsse-key').element.value).to.eql('myKey');
    expect(component.find('#wsse-secret').element.value).to.eql('mySecret');
  });

  it('should set wsse key on the store', () => {
    const key = component.find('#wsse-key');
    key.element.value = 'some_key_name';
    key.trigger('input');

    expect(store.state.auth.params).to.eql({
      key: 'some_key_name'
    });
  });
  it('should set the credentials on the store', () => {
    const key = component.find('#wsse-key');
    key.element.value = 'some_key_name';
    key.trigger('input');

    const secret = component.find('#wsse-secret');
    secret.element.value = 'v3ry53cr3t';
    secret.trigger('input');

    expect(store.state.auth.params).to.eql({
      key: 'some_key_name',
      secret: 'v3ry53cr3t'
    });
  });
});
