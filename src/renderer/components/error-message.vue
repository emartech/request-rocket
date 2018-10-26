<template>
  <div
    id="error-message"
    :class="animationClass"
    class="e-alert e-alert-fixed e-alert-withicon e-alert-danger alert-top">
    <span class="e-alert__icon">
      <!-- eslint-disable -->
      <e-icon icon="warning"></e-icon>
    </span>
    {{ errorMessage }}
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ErrorMessage',
  computed: {
    ...mapState({
      errorMessage: state => state.error.message,
      animationClass: state => (state.error.visible ? 'opened' : '')
    })
  }
};
</script>

<style scoped>
.alert-top {
  top: 0;
  transition: transform 0.25s linear;
  transform: translateY(-100%);
}
.opened {
  transform: translateY(0%);
}
</style>
