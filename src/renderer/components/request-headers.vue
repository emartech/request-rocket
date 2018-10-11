<template>
  <div>
    <h6>Request headers</h6>
    <pre id="request-headers">{{ requestHeaders }}</pre>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'RequestHeaders',
  computed: {
    ...mapState(['requestHeaders'])
  }
};
</script>

<style scoped>
</style>
