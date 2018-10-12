<template>
  <div>
    <div class="e-field">
      <label
        class="e-field__label"
        for="auth-selector"/>
      <e-select>
        <select
          id="auth-selector"
          :value="selectedAuthTypeId"
          class="e-select e-select-inline auth-type"
          @change="selectAuthType($event.target.value)">
          <option
            v-for="auth in authTypes"
            :value="auth.id"
            :key="auth.id">{{ auth.label }}</option>
        </select>
      </e-select>
    </div>
    <wsse-editor v-if="isWsseOptionSelected" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Action from '../store/action-types';
import WsseEditor from './wsse-editor';
import Auth from '../../common/auth-types';

export default {
  name: 'AuthEditor',
  components: { WsseEditor },
  computed: {
    ...mapGetters(['authTypes', 'selectedAuthTypeId']),
    isWsseOptionSelected() {
      return this.selectedAuthTypeId === Auth.wsse;
    }
  },
  methods: {
    ...mapActions([Action.selectAuthType])
  }
};
</script>

<style scoped>
</style>
