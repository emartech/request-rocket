<template>
  <div>
    <h1 class="title">Request Rocket</h1>
    <div>
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
