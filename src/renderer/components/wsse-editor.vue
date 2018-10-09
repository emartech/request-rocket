<template>
  <div>
    <label for="wsse-key">Key</label>
    <input
      id="wsse-key"
      v-model="key"
      type="text"
      @input="setAuthParams()">
    <label for="wsse-secret">Secret</label>
    <input
      id="wsse-secret"
      v-model="secret"
      type="text"
      @input="setAuthParams()">
  </div>
</template>

<script>
import Action from '../store/action-types';

export default {
  name: 'WsseEditor',
  data() {
    return {
      key: null,
      secret: null,
    };
  },
  methods: {
    setAuthParams() {
      const authParams = {
        key: this.key,
        secret: this.secret,
      };
      this.$store.dispatch(Action.setAuthParams, authParams);
    },
  },
};
</script>

<style scoped>
</style>
