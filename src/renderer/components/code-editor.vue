<template>
  <div>
    <codemirror
      :options="cmOptions"
      :value="code"
      @input="onInput"/>
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
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cmOptions: {
        tabSize: 2,
        mode: this.type,
        readOnly: this.readOnly,
        lineNumbers: true
      }
    };
  },
  methods: {
    onInput(value) {
      this.$emit('input', value);
    }
  }
};
</script>

<style scoped>
</style>
