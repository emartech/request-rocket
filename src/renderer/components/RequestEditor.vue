<template>
    <div>
        <input type="text" id="request-editor-url-field" :value="url" @input="setUrl($event.target.value)">
        <input type="button" value="Submit">
    </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'request-editor',
    computed: {
      ...mapState(['url']),
    },
    methods: {
      ...mapActions(['setUrl']),
    },
  };
</script>

<style>
</style>
