<template>
  <div>
    <h6>Request headers</h6>
    <pre id="request-headers">{{ sentRequestHeaders }}</pre>
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
