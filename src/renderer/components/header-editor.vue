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
    updateHeaders(newHeaderValue, index, field) {
      const newHeaders = this.requestHeadersWithEmptyRow;
      newHeaders[index][field] = newHeaderValue;

      const headersWithoutEmptyRow = newHeaders.filter(this.isHeaderEmpty);

      this.$store.dispatch(Action.setRequestHeaders, headersWithoutEmptyRow);
    },
    isHeaderEmpty(header) {
      return !(header.name === '' && header.value === '');
    }
  }
};
</script>

<style scoped>
</style>
