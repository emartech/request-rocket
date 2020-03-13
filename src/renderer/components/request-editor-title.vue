<template>
  <div class="e-fullheight__header">
    <h2>Request</h2>
    <div class="e-fullheight__actions">
      <button
        class="e-btn e-btn-link previous-state"
        @click="previousState">
        previous state
      </button>
      <button
        class="e-btn e-btn-link next-state"
        @click="nextState">
        next state
      </button>
      <button
        class="e-btn e-btn-link reset-state"
        @click="resetState">
        reset all settings
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'RequestEditorTitle',
  methods: {
    ...mapActions(['previousState', 'nextState', 'resetState'])
  }
};
</script>

<style>
</style>
