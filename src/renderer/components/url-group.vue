<template>
  <div class="e-grid e-grid-medium">
    <div class="e-cell e-cell-medium">
      <e-select
        :value="method"
        class="http-method"
        data-test="method-selector"
        @change="selectHttpMethod($event.target.value)">
        <e-select-option
          v-for="methodOption in httpMethodOptions"
          :value="methodOption.id"
          :selected="method === methodOption.id"
          :key="methodOption.id">{{ methodOption.label }}
        </e-select-option>
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
        class="e-btn e-btn-primary"
        type="button"
        @click="sendRequest">Send</button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { isEmpty, splitEvery } from 'ramda';
import Action from '../store/action-types';
import httpMethodOptions from '../store/method-options';

export default {
  name: 'UrlGroup',
  computed: {
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
