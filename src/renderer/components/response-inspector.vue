<template>
  <div class="e-fullheight__content e-fullheight__content-box">
    <div class="e-fullheight__header">
      <h2>Response</h2>
    </div>
    <div class="e-fullheight__body">
      <div class="e-accordion e-accordion-stretch">
        <input
          id="sent-headers"
          type="checkbox"
          checked>
        <label
          for="sent-headers"
          class="e-accordion__title">Request headers</label>
        <header-inspector
          id="request-header-inspector"
          :headers="sentRequestHeaders"/>
        <code-editor
          :read-only="true"
          :code="beautifyBody(response.body)"
          :type="responseType"/>
        <input
          id="response-headers"
          type="checkbox"
          checked>
        <label
          for="response-headers"
          class="e-accordion__title">Response headers</label>
        <header-inspector
          id="response-header-inspector"
          :headers="response.headers"/>
        <h6>Status Code</h6>
        <span id="status-code">{{ response.status }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import CodeEditor from './code-editor';
import HeaderInspector from './header-inspector';

export default {
  name: 'ResponseInspector',
  components: { CodeEditor, HeaderInspector },
  computed: {
    ...mapState(['response', 'sentRequestHeaders']),
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
