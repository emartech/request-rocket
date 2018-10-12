<template>
  <div>
    <request-editor/>
    <response-inspector/>
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
