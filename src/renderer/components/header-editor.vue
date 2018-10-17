<template>
  <div>
    <div class="e-grid">
      <div class="e-cell e-cell-6">Header name</div>
      <div class="e-cell e-cell-6">Header value</div>
    </div>
    <div
      v-for="(header, index) in headers"
      :key="index"
      class="e-grid">
      <div class="e-cell e-cell-auto">
        <input
          :value="header.name"
          class="header-name e-input"
          placeholder="Name"
          @input="updateHeader($event.target.value, index, 'name')">
      </div>
      <div class="e-cell e-cell-auto">
        <input
          :value="header.value"
          class="header-value e-input"
          placeholder="Value"
          @input="updateHeader($event.target.value, index, 'value')">
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { clone } from 'ramda';
import Action from '../store/action-types';

export default {
  name: 'HeaderEditor',
  computed: {
    ...mapState({
      headers: state => state.request.headers
    })
  },
  methods: {
    updateHeader(newHeaderValue, index, field) {
      const newHeaders = clone(this.headers);
      newHeaders[index][field] = newHeaderValue;

      this.$store.dispatch(Action.setRequestHeaders, newHeaders);
    }
  }
};
</script>

<style scoped>
</style>
