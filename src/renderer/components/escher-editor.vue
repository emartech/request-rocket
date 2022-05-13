<template>
  <div>
    <div class="e-grid e-grid-medium">
      <div class="e-cell e-cell-medium e-cell-2">
        <label
          for="escher-key"
          class="e-field__label e-field__label-inline">Key</label>
      </div>
      <div class="e-cell e-cell-medium e-cell-auto">
        <input
          id="escher-key"
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
          for="escher-secret">Secret</label>
      </div>
      <div class="e-cell e-cell-medium e-cell-auto">
        <input
          id="escher-secret"
          v-model="secret"
          class="e-input"
          type="password"
          placeholder="Secret">
      </div>
    </div>
    <div class="e-grid e-grid-medium">
      <div class="e-cell e-cell-medium e-cell-2">
        <label
          class="e-field__label e-field__label-inline"
          for="credential-scope">Credential scope</label>
      </div>
      <div class="e-cell e-cell-medium e-cell-auto">
        <input
          id="credential-scope"
          v-model="credentialScope"
          class="e-input"
          type="text"
          placeholder="Credential scope">
      </div>
    </div>
  </div>
</template>

<script>
import Mutation from '../store/mutation-types';

export default {
  name: 'EscherEditor',
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
    },
    credentialScope: {
      get() {
        return this.$store.state.auth.params.credentialScope;
      },
      set(credentialScope) {
        this.mergeAuthParams({ credentialScope });
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
