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
          placeholder="Key"
          @input="setAuthParams()">
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
          placeholder="Secret"
          @input="setAuthParams()">
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
          placeholder="Credential scope"
          @input="setAuthParams()">
      </div>
    </div>
  </div>
</template>

<script>
import Action from '../store/action-types';

export default {
  name: 'EscherEditor',
  data() {
    return {
      key: null,
      secret: null,
      credentialScope: null
    };
  },
  methods: {
    setAuthParams() {
      const authParams = {
        key: this.key,
        secret: this.secret,
        credentialScope: this.credentialScope
      };
      this.$store.dispatch(Action.setAuthParams, authParams);
    }
  }
};
</script>

<style scoped>
</style>
