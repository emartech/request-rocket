<template>
  <div>
    <request-headers/>
    <code-editor
      :code="response.body"
      :type="responseType"/>
    <response-headers/>
    <h6>Status Code</h6>
    <span id="status-code">{{ response.status }}</span>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import CodeEditor from './code-editor';
import ResponseHeaders from './response-headers';
import RequestHeaders from './request-headers';

export default {
  name: 'ResponseInspector',
  components: { CodeEditor, ResponseHeaders, RequestHeaders },
  computed: {
    ...mapState(['response', 'requestHeaders']),
    ...mapGetters(['responseType'])
  }
};
</script>

<style scoped>
</style>
