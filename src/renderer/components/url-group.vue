<template>
  <div class="e-grid e-grid-medium">
    <div class="e-cell e-cell-medium">
      <e-select>
        <select
          :value="method"
          class="e-select http-method"
          @change="selectHttpMethod($event.target.value)">
          <option
            v-for="method in httpMethodOptions"
            :value="method.id"
            :key="method.id">{{ method.label }}</option>
        </select>
      </e-select>
    </div>
    <div class="e-cell e-cell-auto e-cell-medium">
      <e-tooltip
        id="request-editor-url-tooltip"
        :content="urlInTooltip"
        :disabled="shouldDisplayUrlInTooltip"
        block
        inverse>
        <input
          id="request-editor-url-field"
          :disabled="!isNetworkAvailable"
          :value="url"
          class="e-input"
          placeholder="URL"
          type="text"
          @input="setUrl($event.target.value)"
          @keyup.enter="sendRequest">
      </e-tooltip>
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
import { isEmpty, splitEvery } from 'ramda';
import Action from '../store/action-types';
import httpMethodOptions from '../store/method-options';

export default {
  name: 'UrlGroup',
  computed: {
    ...mapGetters(['isNetworkAvailable']),
    ...mapState({
      url: state => state.request.url,
      httpMethodOptions: () => httpMethodOptions,
      method: state => state.request.method,
      urlInTooltip: state => splitEvery(100, state.request.url).join('<br>'),
      shouldDisplayUrlInTooltip: state => isEmpty(state.request.url)
    })
  },
  methods: {
    ...mapActions([Action.sendRequest, Action.setUrl, Action.selectHttpMethod])
  }
};
</script>

<style>
</style>
