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
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import Action from '../store/action-types';

export default {
  name: 'AuthEditor',
  computed: {
    ...mapGetters(['authTypes', 'selectedAuthTypeId']),
  },
  methods: {
    ...mapActions([Action.selectAuthType]),
  },
};
</script>
<style scoped>
</style>
