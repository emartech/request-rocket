<template>
  <div>
    <select class="auth-type">
      <option
        v-for="auth in authTypes"
        :value="auth.type"
        :key="auth.type">{{ auth.label }}</option>
    </select>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AuthEditor',
  computed: {
    ...mapGetters(['authTypes']),
  },
};
</script>
<style scoped>
</style>
