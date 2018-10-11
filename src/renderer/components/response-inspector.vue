<template>
  <div>
    <request-headers/>
    <h6>Response Body</h6>
    <codemirror
      :options="cmOptions"
      :value="response.body" />
    <h6>Response Headers</h6>
    <pre id="response-headers">{{ response.headers }}</pre>
    <h6>Status Code</h6>
    <span id="status-code">{{ response.status }}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import RequestHeaders from './request-headers';

export default {
  name: 'ResponseInspector',
  components: { codemirror, RequestHeaders },
  data() {
    return {
      cmOptions: {
        tabSize: 2,
        mode: 'application/json',
        readOnly: true,
        lineNumbers: true,
        line: true
      }
    };
  },
  computed: {
    ...mapState(['response', 'requestHeaders'])
  }
};
</script>

<style scoped>
</style>
