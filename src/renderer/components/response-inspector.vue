<template>
    <div>
        <pre id="response-body">{{response.body}}</pre>
    </div>

</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'response-inspector',
    computed: {
      ...mapState(['response']),
    },
  };
</script>

<style scoped>
</style>
