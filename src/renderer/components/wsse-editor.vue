<template>
  <div class="e-grid e-grid-medium">
    <div class="e-cell e-cell-medium">
      <div class="e-field">
        <label
          for="wsse-key"
          class="e-field__label e-field__label-inline">Key</label>
        <input
          id="wsse-key"
          v-model="key"
          class="e-input e-input-large"
          type="text"
          @input="setAuthParams()">
      </div>
    </div>
    <div class="e-cell e-cell-medium">
      <div class="e-field">
        <label
          class="e-field__label e-field__label-inline"
          for="wsse-secret">Secret</label>
        <input
          id="wsse-secret"
          v-model="secret"
          class="e-input e-input-large"
          type="text"
          @input="setAuthParams()">
      </div>
    </div>
  </div>
</template>

<script>
import Action from '../store/action-types';

export default {
  name: 'WsseEditor',
  data() {
    return {
      key: null,
      secret: null
    };
  },
  methods: {
    setAuthParams() {
      const authParams = {
        key: this.key,
        secret: this.secret
      };
      this.$store.dispatch(Action.setAuthParams, authParams);
    }
  }
};
</script>

<style scoped>
</style>
