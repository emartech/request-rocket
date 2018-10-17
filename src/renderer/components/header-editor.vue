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
          @input="updateHeaderName($event.target.value, index)">
      </div>
      <div class="e-cell e-cell-auto">
        <input
          :value="header.value"
          class="header-value e-input"
          placeholder="Value"
          @input="updateHeaderValue($event.target.value, index)">
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
    updateHeaderName(newHeaderName, index) {
      const newHeaders = clone(this.headers);

      newHeaders[index].name = newHeaderName;

      this.$store.dispatch(Action.setRequestHeaders, newHeaders);
    },
    updateHeaderValue(newHeaderValue, index) {
      const newHeaders = clone(this.headers);

      newHeaders[index].value = newHeaderValue;

      this.$store.dispatch(Action.setRequestHeaders, newHeaders);
    }
  }
};
</script>

<style scoped>
</style>
