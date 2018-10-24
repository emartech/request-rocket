<template>
  <div class="e-emptystate e-emptystate-top">
    <div class="e-emptystate__content">
      <div class="e-emptystate__title">
        Sending in progress
      </div>
      <div class="e-emptystate__lead">
        The request is being sent...
        <br><br>
        <button class="e-btn">
          Cancel
        </button>
        <br><br>
      </div>
      <e-spinner data-size="large"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SendingInProgress'
};
</script>

<style>
</style>
