<template>
  <div>
    <div v-for="header in headers">
      <input
        v-model="header.name"
        class="header-name">
      <input
        v-model="header.value"
        class="header-value">
    </div>
    <!-- <div class="e-grid">
      <div class="e-cell e-cell-1">
        <div class="doc-griditem doc-griditem-auto"/>
      </div>
      <div class="e-cell e-cell-5">
        <div class="doc-griditem doc-griditem-auto">
          Name
        </div>
      </div>
      <div class="e-cell e-cell-5">
        <div class="doc-griditem doc-griditem-auto">
          Value
        </div>
      </div>
      <div class="e-cell e-cell-1">
        <div class="doc-griditem doc-griditem-auto"/>
      </div>
    </div>
    <div
      v-for="(header, index) in headers"
      :key="index"
      class="e-grid">
      <div class="e-cell e-cell-1">
        <div class="doc-griditem doc-griditem-auto">
          <div class="e-field">
            <input
              id="cb0"
              v-model="header.send"
              class="e-checkbox e-checkbox-onlycheckbox"
              type="checkbox">
            <label for="cb0"/>
          </div>
        </div>
      </div>
      <div class="e-cell e-cell-5">
        <div class="doc-griditem doc-griditem-auto">
          <div class="e-field">
            <input
              v-model="header.name"
              class="e-input"
              type="text">
          </div>
        </div>
      </div>
      <div class="e-cell e-cell-5">
        <div class="doc-griditem doc-griditem-auto">
          <div class="e-field">
            <input
              v-model="header.value"
              class="e-input"
              type="text">
          </div>
        </div>
      </div>
      <div class="e-cell e-cell-1">
        <div class="doc-griditem doc-griditem-auto">
          <div class="e-btn e-btn-onlyicon">
            <e-icon icon="trash-o"/>
          </div>
        </div>
      </div>
    </div> -->
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
