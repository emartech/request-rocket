<template>
  <div class="e-fullheight__wrapper">
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
