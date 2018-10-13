<template>
  <div>
    <codemirror
      :options="cmOptions"
      :value="code" />
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';

export default {
  name: 'CodeEditor',
  components: { codemirror },
  props: {
    code: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      cmOptions: {
        tabSize: 2,
        mode: this.type,
        readOnly: true,
        lineNumbers: true
      }
    };
  }
};
</script>

<style scoped>
</style>
