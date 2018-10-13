<template>
  <div>
    <request-headers/>
    <code-editor
      :code="beautifyBody(response.body)"
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
  },
  methods: {
    beautifyBody() {
      if (this.responseType === 'application/json') {
        let body;
        try {
          body = JSON.parse(this.response.body);
        } catch (error) {
          return this.response.body;
        }
        return JSON.stringify(body, null, 2);
      }
      return this.response.body;
    }
  }
};
</script>

<style scoped>
</style>
