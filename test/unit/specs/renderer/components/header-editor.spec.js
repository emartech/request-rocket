import { shallowMount } from '@vue/test-utils';
import HeaderEditor from '@/components/header-editor';
import createStore from '@/store';
import Mutation from '../../../../../src/renderer/store/mutation-types';

describe('HeaderEditor.vue', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('should render inputs for content-type header by default', () => {
    const component = shallowMount(HeaderEditor, { store });

    expect(component.find('input.header-name').element.value).to.eql('content-type');
    expect(component.find('input.header-value').element.value).to.eql('application/json');
  });

  it('should change input value for a header when header changes in store', () => {
    const component = shallowMount(HeaderEditor, { store });

    store.commit(Mutation.SET_REQUEST_HEADERS, [{ name: 'Content-Type', value: 'text/plain' }]);

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

  context('when more header item is present', () => {
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
  });
});
