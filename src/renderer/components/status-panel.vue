<template>
  <div class="e-grid">
    <div class="e-cell e-cell-4">
      <div class="e-legend">
        <div class="e-legend__title">
          Status
        </div>
        <div class="e-legend__value text-color-info">
          {{ statusCode }}
        </div>
      </div>
    </div>
    <div class="e-cell e-cell-4">
      <div class="e-legend">
        <div class="e-legend__title">
          Time
        </div>
        <div class="e-legend__value text-color-info">
          214 ms
        </div>
      </div>
    </div>
    <div class="e-cell e-cell-4">
      <div class="e-legend">
        <div class="e-legend__title">
          Size
        </div>
        <div class="e-legend__value text-color-info">
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
      statusCode: state => state.response.status
    })
  }
};
</script>

<style>
</style>
