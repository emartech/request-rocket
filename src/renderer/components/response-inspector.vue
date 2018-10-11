<template>
  <div>
    <h6>Response Body</h6>
    <codemirror
      :options="cmOptions"
      :value="response.body" />
    <h6>Response Headers</h6>
    <pre id="response-headers">{{ response.headers }}</pre>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';

export default {
  name: 'ResponseInspector',
  components: { codemirror },
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
    ...mapState(['response'])
  }
};
</script>

<style scoped>
</style>
