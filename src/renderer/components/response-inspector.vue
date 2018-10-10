<template>
  <div>
    <h6>Response Body</h6>
    <pre id="response-body">{{ response.body }}</pre>
    <h6>Response Headers</h6>
    <pre id="response-headers">{{ response.headers }}</pre>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ResponseInspector',
  computed: {
    ...mapState(['response'])
  },
};
</script>

<style scoped>
</style>
