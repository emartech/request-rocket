import { shallowMount } from '@vue/test-utils';
import Vue from 'vue';
import HeaderEditor from '@/components/header-editor';
import createStore from '@/store';
import Mutation from '../../../../../src/renderer/store/mutation-types';

describe('HeaderEditor.vue', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('should change input value for a header when header changes in store', async () => {
    const component = shallowMount(HeaderEditor, { store });

    store.commit(Mutation.SET_REQUEST_HEADERS, [{ name: 'Content-Type', value: 'text/plain' }]);

    await Vue.nextTick();

    expect(component.find('input.header-name').element.value).to.eql('Content-Type');
    expect(component.find('input.header-value').element.value).to.eql('text/plain');
  });

  it('should change header name in store when header name value changes', () => {
    const component = shallowMount(HeaderEditor, { store });
    const headerNameInput = component.find('input.header-name');

    headerNameInput.element.value = 'Content-Type';
    headerNameInput.trigger('input');

    expect(store.state.request.headers[0].name).to.eql('Content-Type');
  });

  it('should change header name in store when header name value changes', () => {
    const component = shallowMount(HeaderEditor, { store });
    const headerNameInput = component.find('input.header-value');

    headerNameInput.element.value = 'text/plain';
    headerNameInput.trigger('input');

    expect(store.state.request.headers[0].value).to.eql('text/plain');
  });

  context('when more header items are present', () => {
    it('should render inputs for all header elements', () => {
      const headers = [
        { name: 'my-header', value: 'my-header-value' },
        { name: 'other-header', value: 'other-header-value' }
      ];
      store.commit(Mutation.SET_REQUEST_HEADERS, headers);

      const component = shallowMount(HeaderEditor, { store });

      const headerNameInputs = component.findAll('input.header-name');
      const headerValueInputs = component.findAll('input.header-value');

      headers.forEach((header, index) => {
        expect(headerNameInputs.at(index).element.value).to.eql(header.name);
        expect(headerValueInputs.at(index).element.value).to.eql(header.value);
      });
    });
    it('should not store empty headers', () => {
      const headers = [
        { name: 'my-header', value: 'my-header-value' },
        { name: 'other-header', value: 'other-header-value' }
      ];
      store.commit(Mutation.SET_REQUEST_HEADERS, headers);

      const component = shallowMount(HeaderEditor, { store });

      const headerNameInputs = component.findAll('input.header-name');
      const headerValueInputs = component.findAll('input.header-value');

      headerNameInputs.at(0).element.value = '';
      headerNameInputs.at(0).trigger('input');
      headerValueInputs.at(0).element.value = '';
      headerValueInputs.at(0).trigger('input');

      expect(store.state.request.headers).to.eql([{ name: 'other-header', value: 'other-header-value' }]);
    });
  });

  it('should add new empty input fields at the end of the headers list', () => {
    const headers = [
      { name: 'my-header', value: 'my-header-value' },
      { name: 'other-header', value: 'other-header-value' }
    ];
    store.commit(Mutation.SET_REQUEST_HEADERS, headers);

    const component = shallowMount(HeaderEditor, { store });

    expect(component.findAll('input.header-name').length).to.equal(3);
    expect(component.findAll('input.header-value').length).to.equal(3);
  });

  it('should remove header item on click', () => {
    const headers = [
      { name: 'my-header', value: 'my-header-value' },
      { name: 'other-header', value: 'other-header-value' }
    ];
    store.commit(Mutation.SET_REQUEST_HEADERS, headers);

    const component = shallowMount(HeaderEditor, { store });

    const deleteButtons = component.findAll('.remove-header');
    deleteButtons.at(0).trigger('click');

    expect(store.state.request.headers).to.eql([{ name: 'other-header', value: 'other-header-value' }]);
  });

  it('should disable remove header button for the dynamically added last row', () => {
    const headers = [{ name: 'my-header', value: 'my-header-value' }];
    store.commit(Mutation.SET_REQUEST_HEADERS, headers);

    const component = shallowMount(HeaderEditor, { store });

    const deleteButtons = component.findAll('.remove-header');

    expect(deleteButtons.at(1).attributes('disabled')).to.equal('disabled');
  });

  context('header item checkbox', () => {
    it('should be checked by default', () => {
      store.commit(Mutation.SET_REQUEST_HEADERS, [
        { name: 'content-type', value: 'application/json', sendingStatus: true }
      ]);

      const component = shallowMount(HeaderEditor, { store });

      const checkBoxes = component.findAll('.sending-status');

      expect(checkBoxes.at(0).element.checked).to.equal(true);
    });

    it('should change sending status when checkbox is clicked', () => {
      store.commit(Mutation.SET_REQUEST_HEADERS, [{ name: 'content-type', value: 'application/json' }]);

      const component = shallowMount(HeaderEditor, { store });

      const checkBoxes = component.findAll('.sending-status');

      checkBoxes.at(0).element.checked = false;
      checkBoxes.at(0).element.dispatchEvent(new Event('change'));

      expect(store.state.request.headers).to.eql([
        { name: 'content-type', value: 'application/json', sendingStatus: false }
      ]);
    });
    it('should be disabled for the dynamically added last row', () => {
      const component = shallowMount(HeaderEditor, { store });
      const checkBoxes = component.findAll('.sending-status');

      expect(checkBoxes.at(0).attributes('disabled')).to.equal('disabled');
    });
  });
});
