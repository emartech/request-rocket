<template>
  <div>
    <select
      :value="selectedAuthTypeId"
      class="auth-type"
      @input="selectAuthType($event.target.value)">
      <option
        v-for="auth in authTypes"
        :value="auth.id"
        :key="auth.id">{{ auth.label }}</option>
    </select>
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
