<template>
  <div class="e-accordion__content">
    <div id="request-headers">
      <div
        v-for="(value, header) in sentRequestHeaders"
        :key="header">
        <strong>{{ header }}:</strong>&nbsp;{{ value }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'RequestHeaders',
  computed: {
    ...mapState(['sentRequestHeaders'])
  }
};
</script>

<style scoped>
</style>
