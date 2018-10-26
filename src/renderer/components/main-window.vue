<template>
  <div class="e-fullheight__wrapper">
    <error-message/>
    <div class="e-fullheight__container">
      <request-editor/>
      <response-inspector/>
    </div>
  </div>
</template>

<script>
import RequestEditor from './request-editor';
import ResponseInspector from './response-inspector';
import ErrorMessage from './error-message';

export default {
  name: 'MainWindow',
  components: { RequestEditor, ResponseInspector, ErrorMessage }
};
</script>

<style>
</style>
