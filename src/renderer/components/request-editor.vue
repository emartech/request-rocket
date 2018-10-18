<template>
  <div class="e-box e-box-simple">
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
</template>

<script>
import AuthEditor from './auth-editor';
import CodeEditor from './code-editor';
import ContentTypeSelector from './content-type-selector';
import UrlGroup from './url-group';
import HeaderEditor from './header-editor';
import RequestBodyEditor from './request-body-editor';

export default {
  name: 'RequestEditor',
  components: { UrlGroup, ContentTypeSelector, CodeEditor, AuthEditor, HeaderEditor, RequestBodyEditor }
};
</script>

<style>
</style>
