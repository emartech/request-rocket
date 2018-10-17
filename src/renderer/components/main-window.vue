<template>
  <div>
    <div class="e-grid">
      <div class="e-cell e-cell-7">
        <request-editor/>
      </div>
      <div class="e-cell e-cell-5">
        <response-inspector/>
      </div>
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
