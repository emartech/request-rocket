<template>
  <div
    class="e-fullheight__content e-fullheight__content-box"
    style="flex-basis: 40%">
    <div class="e-fullheight__header">
      <h2>Response</h2>
    </div>
    <div
      v-if="sendingInProgress"
      class="e-fullheight__body">
      <sending-in-progress/>
    </div>
    <div
      v-else
      class="e-fullheight__body">
      <div v-if="!responseDataAvailable">
        <empty-state/>
      </div>
      <div
        v-if="responseDataAvailable"
        id="response-details">
        <div class="e-field">
          <status-panel/>
        </div>
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
          <input
            id="body-inspector"
            type="checkbox"
            checked>
          <label
            for="body-inspector"
            class="e-accordion__title">Body</label>
          <div class="e-accordion__content">
            <code-editor
              :read-only="true"
              :code="beautifyBody(response.body)"
              :type="responseType"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { isEmpty } from 'ramda';
import CodeEditor from './code-editor';
import HeaderInspector from './header-inspector';
import StatusPanel from './status-panel';
import EmptyState from './empty-state';
import SendingInProgress from './sending-in-progress';

export default {
  name: 'ResponseInspector',
  components: { CodeEditor, HeaderInspector, StatusPanel, EmptyState, SendingInProgress },
  computed: {
    ...mapState(['response', 'sentRequestHeaders', 'sendingInProgress']),
    ...mapState({
      responseDataAvailable: state => !isEmpty(state.response)
    }),
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
