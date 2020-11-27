<template>
  <div class="e-fullheight__content e-fullheight__content-box e-border-all">
    <request-editor-title/>
    <div class="e-fullheight__body">
      <div class="e-field">
        <url-group/>
      </div>
      <div class="e-accordion e-accordion-stretch">
        <input
          id="header-editor"
          type="checkbox"
          checked>
        <label
          for="header-editor"
          class="e-accordion__title">Header</label>
        <header-editor/>
        <input
          id="body-editor"
          :disabled="!isRequestBodyEditAvailable"
          :checked="bodyEditorIsVisible"
          type="checkbox"
          @change="setBodyEditorVisibility($event.target.checked)">
        <label
          for="body-editor"
          class="e-accordion__title">Body</label>
        <request-body-editor v-if="bodyEditorIsVisible"/>
        <input
          id="auth-editor"
          type="checkbox"
          checked>
        <label
          for="auth-editor"
          class="e-accordion__title">Authentication</label>
        <auth-editor/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AuthEditor from './auth-editor';
import CodeEditor from './code-editor';
import ContentTypeSelector from './content-type-selector';
import UrlGroup from './url-group';
import HeaderEditor from './header-editor';
import RequestBodyEditor from './request-body-editor';
import RequestEditorTitle from './request-editor-title';

export default {
  name: 'RequestEditor',
  components: {
    UrlGroup,
    ContentTypeSelector,
    CodeEditor,
    AuthEditor,
    HeaderEditor,
    RequestBodyEditor,
    RequestEditorTitle
  },
  data() {
    return { editorShown: true };
  },
  computed: {
    ...mapGetters(['isRequestBodyEditAvailable']),
    bodyEditorIsVisible() {
      return this.isRequestBodyEditAvailable && this.editorShown;
    }
  },
  methods: {
    setBodyEditorVisibility(desiredState) {
      this.editorShown = desiredState;
    }
  }
};
</script>
