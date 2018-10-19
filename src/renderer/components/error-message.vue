<template>
  <div
    id="error-message"
    class="e-alert e-alert-fixed e-alert-withicon e-alert-danger"
    style="top: 0">
    <span class="e-alert__icon">
      <!-- eslint-disable -->
      <e-icon icon="warning"></e-icon>
    </span>
    {{ errorMessage }}
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ErrorMessage',
  computed: {
    ...mapState(['errorMessage'])
  }
};
</script>

<style>
</style>
