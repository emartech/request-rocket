<template>
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
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import Action from '../store/action-types';
import httpMethodOptions from '../store/method-options';

export default {
  name: 'UrlGroup',
  computed: {
    ...mapGetters(['isNetworkAvailable']),
    ...mapState({
      url: state => state.request.url,
      httpMethodOptions: () => httpMethodOptions,
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
