<template>
  <div>
    <div class="e-field">
      <label
        class="e-field__label"
        for="auth-selector"/>
      <e-select>
        <select
          id="auth-selector"
          :value="selectedAuthType"
          class="e-select e-select-inline auth-type"
          @change="selectAuthType($event.target.value)">
          <option
            v-for="auth in authOptions"
            :value="auth.id"
            :key="auth.id">{{ auth.label }}</option>
        </select>
      </e-select>
    </div>
    <wsse-editor v-if="isWsseAuthSelected" />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import Action from '../store/action-types';
import WsseEditor from './wsse-editor';
import authOptions from '../store/auth-options';

export default {
  name: 'AuthEditor',
  components: { WsseEditor },
  computed: {
    ...mapGetters(['isWsseAuthSelected']),
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
