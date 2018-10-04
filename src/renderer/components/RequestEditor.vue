<template>
    <div>
        <input type="text" id="request-editor-url-field" :value="url">
        <input type="button" value="Submit">
    </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'request-editor',
    computed: {
      ...mapState(['url']),
    },
  };
</script>

<style>
</style>
