import { mount } from '@vue/test-utils';
import CodeEditor from '@/components/code-editor';

describe('CodeEditor.vue', () => {
  it('should render a codemirror component with the proper contents', () => {
    const component = mount(CodeEditor, { propsData: { code: '{"foo": "bar"}' } });
    const codeMirror = component.find({ name: 'codemirror' });
    expect(codeMirror.element.textContent).to.equal('{"foo": "bar"}');
  });

  context('given options in props', () => {
    it('should set the proper content type', () => {
      const component = mount(CodeEditor, { propsData: { type: 'text/plain' } });
      const codeMirror = component.find({ name: 'codemirror' });
      expect(codeMirror.props('options')).to.have.property('mode', 'text/plain');
    });

    it('should set read-only mode', () => {
      const component = mount(CodeEditor, { propsData: { readOnly: true } });
      const codeMirror = component.find({ name: 'codemirror' });
      expect(codeMirror.props('options')).to.have.property('readOnly', true);
    });
  });

  it('should propagate input event', () => {
    const component = mount(CodeEditor);
    const codeMirror = component.find({ name: 'codemirror' });
    codeMirror.vm.$emit('input', '{"foo": "bar"}');
    expect(component.emitted('input')[0]).eql(['{"foo": "bar"}']);
  });
});
