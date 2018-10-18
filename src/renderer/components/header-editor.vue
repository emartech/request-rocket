<template>
  <div class="e-accordion__content">
    <div
      v-for="(header, index) in requestHeadersWithEmptyRow"
      :key="index"
      class="e-grid e-grid-medium e-grid-vertical_center">
      <div class="e-cell e-cell-medium">
        <input
          class="e-checkbox e-checkbox-onlycheckbox"
          type="checkbox">
        <label>&nbsp;</label>
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
          :disabled="!showDeleteButton(header)"
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
    showDeleteButton(header) {
      return this.isHeaderNotEmpty(header);
    },
    isHeaderNotEmpty(header) {
      return !(header.name === '' && header.value === '');
    },
    removeHeader(index) {
      const headers = this.requestHeadersWithEmptyRow;
      headers.splice(index, 1);
      this.storeHeaders(headers);
    }
  }
};
</script>

<style scoped>
</style>
