<template>
  <div>
    <request-headers/>
    <h6>Response Body</h6>
    <codemirror
      :options="getCodemirrorOptions()"
      :value="response.body" />
    <response-headers/>
    <h6>Status Code</h6>
    <span id="status-code">{{ response.status }}</span>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import ResponseHeaders from './response-headers';
import RequestHeaders from './request-headers';

export default {
  name: 'ResponseInspector',
  components: { codemirror, ResponseHeaders, RequestHeaders },
  computed: {
    ...mapState(['response', 'requestHeaders']),
    ...mapGetters(['responseType'])
  },
  methods: {
    getCodemirrorOptions() {
      return {
        tabSize: 2,
        mode: this.responseType,
        readOnly: true,
        lineNumbers: true
      };
    }
  }
};
</script>

<style scoped>
</style>
