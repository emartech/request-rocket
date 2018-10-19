<template>
  <div class="e-fullheight__wrapper">
    <div
      v-if="errorOccurred"
      class="e-alert e-alert-fixed e-alert-withicon e-alert-danger"
      style="top: 0">
      <span class="e-alert__icon">
        <!-- eslint-disable -->
        <e-icon icon="warning"></e-icon>
      </span>
      Something went wrong...
    </div>
    <div class="e-fullheight__container">
      <request-editor/>
      <response-inspector/>
    </div>
  </div>
</template>

<script>
import RequestEditor from './request-editor';
import ResponseInspector from './response-inspector';

export default {
  name: 'MainWindow',
  components: { RequestEditor, ResponseInspector }
};
</script>

<style>
</style>
