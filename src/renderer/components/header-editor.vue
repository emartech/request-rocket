<template>
  <div class="e-accordion__content">
    <div
      v-for="(header, index) in requestHeadersWithEmptyRow"
      :key="index"
      class="e-grid e-grid-medium e-grid-vertical_center">
      <div class="e-cell e-cell-medium">
        <input
          :id="`checkbox${index}`"
          :checked="isSendingStatusChecked(index)"
          :disabled="isControlDisabled(header)"
          class="e-checkbox e-checkbox-onlycheckbox sending-status"
          type="checkbox"
          @change="updateHeaders($event.target.checked, index, 'sendingStatus')">
        <label :for="`checkbox${index}`">&nbsp;</label>
      </div>
      <div class="e-cell e-cell-4 e-cell-medium">
        <input
          :value="header.name"
          class="header-name e-input"
          placeholder="Name"
          @input="updateHeaders($event.target.value, index, 'name')">
      </div>
      <div class="e-cell e-cell-auto e-cell-medium">
        <input
          :value="header.value"
          class="header-value e-input"
          placeholder="Value"
          @input="updateHeaders($event.target.value, index, 'value')">
      </div>
      <div class="e-cell e-cell-medium">
        <button
          :disabled="isControlDisabled(header)"
          class="e-btn e-btn-onlyicon remove-header"
          tabindex="-1"
          @click="removeHeader(index)">
          <e-icon icon="trash-o"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Action from '../store/action-types';

export default {
  name: 'HeaderEditor',
  computed: {
    ...mapGetters(['requestHeadersWithEmptyRow'])
  },
  methods: {
    updateHeaders(value, index, field) {
      const headers = this.requestHeadersWithEmptyRow;
      headers[index][field] = value;
      this.storeHeaders(headers);
    },
    storeHeaders(headers) {
      const headersWithoutEmptyRow = headers.filter(this.isHeaderNotEmpty);
      this.$store.dispatch(Action.setRequestHeaders, headersWithoutEmptyRow);
    },
    isControlDisabled(header) {
      return !this.isHeaderNotEmpty(header);
    },
    isHeaderNotEmpty(header) {
      return !(header.name === '' && header.value === '');
    },
    removeHeader(index) {
      const headers = this.requestHeadersWithEmptyRow;
      headers.splice(index, 1);
      this.storeHeaders(headers);
    },
    isSendingStatusChecked(index) {
      const headers = this.requestHeadersWithEmptyRow;
      return index === headers.length - 1 ? false : headers[index].sendingStatus;
    }
  }
};
</script>

<style scoped>
</style>
