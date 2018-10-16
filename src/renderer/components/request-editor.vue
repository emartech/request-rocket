<template>
  <div>
    <select
      :value="method"
      class="http-method"
      @input="selectHttpMethod($event.target.value)">
      <option
        v-for="method in httpMethodOptions"
        :value="method.id"
        :key="method.id">{{ method.label }}</option>
    </select>
    <input
      id="request-editor-url-field"
      :value="url"
      type="text"
      @input="setUrl($event.target.value)">
    <button
      id="request-editor-send-button"
      :disabled="!isNetworkAvailable"
      type="button"
      @click="sendRequest">Send</button>
    <auth-editor/>
    <div v-if="isRequestBodyEditAvailable">
      <h6>Request body</h6>
      <code-editor
        :code="body"
        @input="setRequestBody"/>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import Action from '../store/action-types';
import AuthEditor from './auth-editor';
import CodeEditor from './code-editor';

export default {
  name: 'RequestEditor',
  components: { CodeEditor, AuthEditor },
  computed: {
    ...mapGetters(['isNetworkAvailable', 'isRequestBodyEditAvailable']),
    ...mapState({
      url: state => state.request.url,
      httpMethodOptions: state => state.request.httpMethodOptions,
      method: state => state.request.method,
      body: state => state.request.body
    })
  },
  methods: {
    ...mapActions([Action.sendRequest, Action.setUrl, Action.selectHttpMethod, Action.setRequestBody])
  }
};
</script>

<style>
</style>
