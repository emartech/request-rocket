<template>
  <div class="e-fullheight__wrapper">
    <error-message/>
    <info-message/>
    <div class="e-fullheight__container">
      <split-pane
        :min-percent="20"
        :default-percent="60"
        split="vertical">
        <request-editor slot="paneL"/>
        <response-inspector slot="paneR"/>
      </split-pane>
    </div>
  </div>
</template>

<script>
import RequestEditor from './request-editor';
import ResponseInspector from './response-inspector';
import ErrorMessage from './error-message';
import InfoMessage from './info-message';

export default {
  name: 'MainWindow',
  components: { InfoMessage, RequestEditor, ResponseInspector, ErrorMessage }
};
</script>

<style scoped>
.e-fullheight__container {
  display: block;
}
</style>
