<template>
  <div>
    <div class="e-grid">
      <div class="e-cell e-cell-6">Header name</div>
      <div class="e-cell e-cell-6">Header value</div>
    </div>
    <div
      v-for="(header, index) in requestHeadersWithEmptyRow"
      :key="index"
      class="e-grid">
      <div class="e-cell e-cell-auto">
        <input
          :value="header.name"
          class="header-name e-input"
          placeholder="Name"
          @input="updateHeaders($event.target.value, index, 'name')">
      </div>
      <div class="e-cell e-cell-auto">
        <input
          :value="header.value"
          class="header-value e-input"
          placeholder="Value"
          @input="updateHeaders($event.target.value, index, 'value')">
      </div>
      <div
        class="e-btn e-btn-onlyicon remove-header"
        @click="removeHeader(index)">
        <e-icon icon="trash-o"/>
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
      const headersWithoutEmptyRow = headers.filter(this.isHeaderEmpty);
      this.$store.dispatch(Action.setRequestHeaders, headersWithoutEmptyRow);
    },
    isHeaderEmpty(header) {
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
