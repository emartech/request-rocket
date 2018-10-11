<template>
  <div>
    <h6>Response headers</h6>
    <pre id="response-headers">{{ headers }}</pre>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ResponseHeaders',
  computed: {
    ...mapState({
      headers: state => state.response.headers
    })
  }
};
</script>

<style scoped>
</style>
