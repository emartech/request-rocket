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
          v-model="header.name"
          class="header-name e-input"
          placeholder="Name">
      </div>
      <div class="e-cell e-cell-auto">
        <input
          v-model="header.value"
          class="header-value e-input"
          placeholder="Value">
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'HeaderEditor',
  computed: {
    ...mapState({
      headers: state => state.request.headers
    })
  },
  methods: {}
};
</script>

<style scoped>
</style>
