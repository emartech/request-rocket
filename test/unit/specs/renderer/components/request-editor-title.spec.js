import { shallowMount } from '@vue/test-utils';
import RequestEditorTitle from '@/components/request-editor-title';
import createStore from '@/store';
import sinon from 'sinon';
import { ipcRenderer } from 'electron';
import { initialState } from '../../../../../src/renderer/store';
import Mutation from '../../../../../src/renderer/store/mutation-types';
import FileContent from '../../../../../src/common/file-content';

describe('RequestEditorTitle.vue', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('should render a header', () => {
    const component = shallowMount(RequestEditorTitle, { store });
    const headerElement = component.find('h2');

    expect(headerElement.exists()).to.eql(true);
    expect(headerElement.text()).to.eql('Request');
  });

  it('should render a reset button', () => {
    const component = shallowMount(RequestEditorTitle, { store });

    expect(component.find('a.reset-state').exists()).to.eql(true);
  });

  it('should render a "save as" button', () => {
    const component = shallowMount(RequestEditorTitle, { store });

    expect(component.find('#save-as').exists()).to.eql(true);
  });

  context('when reset button is clicked', () => {
    it('should revert the store back to its initial state', () => {
      const component = shallowMount(RequestEditorTitle, { store });
      const resetButton = component.find('a.reset-state');

      store.commit(Mutation.UPDATE_URL, 'https://some.url');
      resetButton.trigger('click');

      expect(store.state).to.eql(initialState);
    });
  });

  context('when "save as" button is clicked', () => {
    let sandbox;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should call ipcRenderer.send with fileContent', () => {
      const sendStub = sandbox.stub(ipcRenderer, 'send').resolves();
      const toJsonStub = sinon.stub(FileContent, 'toJson').returns('dummyFileContent');
      const store = createStore();
      const component = shallowMount(RequestEditorTitle, { store });
      const saveButton = component.find('#save-as');

      saveButton.trigger('click');

      expect(sendStub).to.be.calledWith('show-save-dialog', 'dummyFileContent');
      expect(toJsonStub).to.be.calledWith();
    });
  });
});
