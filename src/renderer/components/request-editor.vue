<template>
  <div class="e-box e-box-simple">
    <div class="e-grid e-grid-medium">
      <div class="e-cell e-cell-medium">
        <e-select>
          <select
            :value="method"
            class="e-select e-select-inline http-method"
            @change="selectHttpMethod($event.target.value)">
            <option
              v-for="method in httpMethodOptions"
              :value="method.id"
              :key="method.id">{{ method.label }}</option>
          </select>
        </e-select>
      </div>
      <div class="e-cell e-cell-auto e-cell-medium">
        <input
          id="request-editor-url-field"
          :value="url"
          class="e-input"
          type="text"
          @input="setUrl($event.target.value)">
      </div>
      <div class="e-cell e-cell-medium">
        <button
          id="request-editor-send-button"
          :disabled="!isNetworkAvailable"
          class="e-btn e-btn-primary"
          type="button"
          @click="sendRequest">Send</button>
      </div>
    </div>
    <div>
      <auth-editor/>
    </div>
    <div v-if="isRequestBodyEditAvailable">
      <content-type-selector/>
      <code-editor
        :code="body"
        :type="contentType"
        @input="setRequestBody"/>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import Action from '../store/action-types';
import AuthEditor from './auth-editor';
import CodeEditor from './code-editor';
import ContentTypeSelector from './content-type-selector';

export default {
  name: 'RequestEditor',
  components: { ContentTypeSelector, CodeEditor, AuthEditor },
  computed: {
    ...mapGetters(['isNetworkAvailable', 'isRequestBodyEditAvailable']),
    ...mapState({
      url: state => state.request.url,
      httpMethodOptions: state => state.request.httpMethodOptions,
      method: state => state.request.method,
      body: state => state.request.body,
      contentType: state => state.request.contentType
    })
  },
  methods: {
    ...mapActions([Action.sendRequest, Action.setUrl, Action.selectHttpMethod, Action.setRequestBody])
  }
};
</script>

<style>
</style>
