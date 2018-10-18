<template>
  <div
    id="app"
    class="e-fullheight e-boxpadding">
    <router-view/>
  </div>
</template>

<script>
import Action from './store/action-types';

export default {
  name: 'RequestRocket',
  created() {
    window.addEventListener('online', this.updateOnlineStatus('online'));
    window.addEventListener('offline', this.updateOnlineStatus('offline'));
  },
  methods: {
    updateOnlineStatus(status) {
      return () => {
        this.$store.dispatch(Action.setNetworkStatus, status);
      };
    }
  }
};
</script>

<style>
/* CSS */
</style>
