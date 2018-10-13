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
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import Action from '../store/action-types';
import AuthEditor from './auth-editor';

export default {
  name: 'RequestEditor',
  components: { AuthEditor },
  computed: {
    ...mapGetters(['isNetworkAvailable']),
    ...mapState({
      url: state => state.request.url,
      httpMethodOptions: state => state.request.httpMethodOptions,
      method: state => state.request.method
    })
  },
  methods: {
    ...mapActions([Action.sendRequest, Action.setUrl, Action.selectHttpMethod])
  }
};
</script>

<style>
</style>
