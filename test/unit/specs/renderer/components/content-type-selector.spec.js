import { shallowMount } from '@vue/test-utils';
import createStore from '@/store';
import ContentTypeSelector, { contentTypeOptions } from '../../../../../src/renderer/components/content-type-selector';
import ContentType from '../../../../../src/common/content-types';

describe('ContentTypeSelector.vue', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('should render selector for content types', () => {
    const component = shallowMount(ContentTypeSelector, { store });
    const selectElement = component.find('select#content-type');
    expect(selectElement.exists()).to.eql(true);
  });
  it('should render an option per content type', () => {
    const component = shallowMount(ContentTypeSelector, { store });
    const selectElement = component.find('select#content-type');
    contentTypeOptions.forEach(option => {
      const optionElement = selectElement.find(`option[value="${option.id}"]`);
      expect(optionElement.exists()).to.eql(true);
      expect(optionElement.text()).to.equal(option.label);
    });
  });
  it('should set the selected content type on the store', () => {
    const component = shallowMount(ContentTypeSelector, { store });
    const selectElement = component.find('select#content-type');
    selectElement.element.value = ContentType.json;
    selectElement.trigger('change');

    expect(store.state.request.contentType).to.equal(ContentType.json);
  });
});
