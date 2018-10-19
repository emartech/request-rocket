import { mount } from '@vue/test-utils';
import HeaderInspector from '@/components/header-inspector';

describe('HeaderInspector.vue', () => {
  it('should render the given headers', () => {
    const component = mount(HeaderInspector, { propsData: { headers: { foo: 'bar' } } });
    const headerList = component.find('.headers');
    expect(headerList.text()).to.match(/^\s*foo:\s+bar\s*$/);
  });
});
