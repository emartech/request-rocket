<template>
  <div class="e-fullheight__content e-fullheight__content-box">
    <div class="e-fullheight__body">
      <div>
        <request-editor-title/>
      </div>
      <div>
        <url-group/>
      </div>
      <div>
        <header-editor/>
      </div>
      <div>
        <auth-editor/>
      </div>
      <div>
        <request-body-editor/>
      </div>
    </div>
  </div>
</template>

<script>
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
  }
};
</script>

<style>
</style>
