import { mount } from '@vue/test-utils';
import CodeEditor from '@/components/code-editor';

describe('CodeEditor', () => {
  it('should render a codemirror component with the proper contents', async () => {
    const component = mount(CodeEditor, { propsData: { code: '{"foo": "bar"}' } });
    const codeMirror = component.find({ name: 'codemirror' });
    expect(codeMirror.element.textContent).to.equal('{"foo": "bar"}');
  });

  it('should set the proper content type in codemirror options', async () => {
    const component = mount(CodeEditor, { propsData: { type: 'text/plain' } });
    const codeMirror = component.find({ name: 'codemirror' });
    expect(codeMirror.props('options')).to.have.property('mode', 'text/plain');
  });
});
