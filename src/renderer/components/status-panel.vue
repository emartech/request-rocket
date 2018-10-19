<template>
  <div class="e-grid">
    <div class="e-cell e-cell-4">
      <div class="e-legend">
        <div class="e-legend__title">
          Status
        </div>
        <div
          id="status-code"
          class="e-legend__value text-color-info">
          {{ statusCode }}
        </div>
      </div>
    </div>
    <div class="e-cell e-cell-4">
      <div class="e-legend">
        <div class="e-legend__title">
          Time
        </div>
        <div
          id="request-time"
          class="e-legend__value text-color-shade">
          {{ requestTime }} ms
        </div>
      </div>
    </div>
    <div class="e-cell e-cell-4">
      <div class="e-legend">
        <div class="e-legend__title">
          Size
        </div>
        <div class="e-legend__value text-color-shade">
          814 B
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'StatusPanel',
  computed: {
    ...mapState({
      statusCode: state => state.response.status,
      requestTime: state => state.response.elapsedTime
    })
  }
};
</script>

<style>
</style>
