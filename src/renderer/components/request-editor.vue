<template>
  <div class="e-box e-box-simple">
    <div class="e-grid e-grid-medium">
      <div class="e-cell e-cell-auto e-cell-medium">
        <select
          :value="method"
          class="http-method"
          @input="selectHttpMethod($event.target.value)">
          <option
            v-for="method in httpMethodOptions"
            :value="method.id"
            :key="method.id">{{ method.label }}</option>
        </select>
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
