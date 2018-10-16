<template>
  <div>
    <div>
      <request-editor/>
      <h3>Response</h3>
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
