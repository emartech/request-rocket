<template>
  <div>
    <div class="e-grid e-grid-medium">
      <div class="e-cell e-cell-medium e-cell-2">
        <label
          for="wsse-key"
          class="e-field__label e-field__label-inline">Key</label>
      </div>
      <div class="e-cell e-cell-medium e-cell-auto">
        <input
          id="wsse-key"
          v-model="key"
          class="e-input"
          type="text"
          placeholder="Key">
      </div>
    </div>
    <div class="e-grid e-grid-medium">
      <div class="e-cell e-cell-medium e-cell-2">
        <label
          class="e-field__label e-field__label-inline"
          for="wsse-secret">Secret</label>
      </div>
      <div class="e-cell e-cell-medium e-cell-auto">
        <input
          id="wsse-secret"
          v-model="secret"
          class="e-input"
          type="password"
          placeholder="Secret">
      </div>
    </div>
  </div>
</template>

<script>
import Mutation from '../store/mutation-types';

export default {
  name: 'WsseEditor',
  computed: {
    key: {
      get() {
        return this.$store.state.auth.params.key;
      },
      set(key) {
        this.mergeAuthParams({ key });
      }
    },
    secret: {
      get() {
        return this.$store.state.auth.params.secret;
      },
      set(secret) {
        this.mergeAuthParams({ secret });
      }
    }
  },
  methods: {
    mergeAuthParams(param) {
      this.$store.commit(Mutation.MERGE_AUTH_PARAMS, param);
    }
  }
};
</script>

<style scoped>
</style>
