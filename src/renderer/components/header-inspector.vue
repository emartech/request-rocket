<template>
  <div class="e-accordion__content">
    <div class="headers">
      <div
        v-for="(value, name) in headers"
        :key="name">
        <strong>{{ name }}:</strong>&nbsp;{{ value }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderInspector',
  props: {
    headers: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>

<style scoped>
</style>
