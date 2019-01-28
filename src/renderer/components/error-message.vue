<template>
  <div>
    <div
      v-if="hasErrors"
      id="error-message"
      class="e-alert e-alert-fixed e-alert-withicon e-alert-danger"
      style="top: 0">
      <span class="e-alert__icon">
        <!-- eslint-disable -->
        <e-icon icon="warning"></e-icon>
      </span>
      <div
        v-for="(error, index) in errors"
        v-bind:key="index">
        <span>{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { isEmpty } from 'ramda';
import Action from '../store/action-types';

export default {
  name: 'ErrorMessage',
  data() {
    return {
      timer: null
    };
  },
  computed: {
    ...mapState({
      errors: state => state.errors,
      hasErrors: state => !isEmpty(state.errors)
    })
  },
  watch: {
    errors(newValue) {
      clearTimeout(this.timer);

      if (newValue !== []) {
        this.timer = setTimeout(() => {
          this.clearErrors();
        }, 5000);
      }
    }
  },
  methods: {
    ...mapActions([Action.clearErrors])
  }
};
</script>

<style scoped>
</style>
