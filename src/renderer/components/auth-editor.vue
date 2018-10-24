<template>
  <div class="e-accordion__content">
    <div class="e-field">
      <div class="e-grid e-grid-medium e-grid-vertical_center">
        <div class="e-cell e-cell-medium e-cell-2">
          <label
            class="e-field__label e-field__label-inline"
            for="auth-selector">Type</label>
        </div>
        <div class="e-cell e-cell-medium">
          <e-select>
            <select
              id="auth-selector"
              :value="selectedAuthType"
              class="e-select e-select-large auth-type"
              @change="selectAuthType($event.target.value)">
              <option
                v-for="auth in authOptions"
                :value="auth.id"
                :key="auth.id">{{ auth.label }}</option>
            </select>
          </e-select>
        </div>
      </div>
    </div>
    <wsse-editor v-if="isWsseAuthSelected" />
    <escher-editor v-if="isEscherAuthSelected"/>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import Action from '../store/action-types';
import WsseEditor from './wsse-editor';
import authOptions from '../store/auth-options';
import EscherEditor from './escher-editor';

export default {
  name: 'AuthEditor',
  components: { EscherEditor, WsseEditor },
  computed: {
    ...mapGetters(['isWsseAuthSelected', 'isEscherAuthSelected']),
    ...mapState({
      selectedAuthType: state => state.auth.selected
    }),
    authOptions: () => authOptions
  },
  methods: {
    ...mapActions([Action.selectAuthType])
  }
};
</script>

<style scoped>
</style>
