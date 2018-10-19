<template>
  <div class="e-fullheight__wrapper">
    <error-message v-if="errorOccurred"/>
    <div class="e-fullheight__container">
      <request-editor/>
      <response-inspector/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import RequestEditor from './request-editor';
import ResponseInspector from './response-inspector';
import ErrorMessage from './error-message';

export default {
  name: 'MainWindow',
  components: { RequestEditor, ResponseInspector, ErrorMessage },
  computed: {
    ...mapState({
      errorOccurred: state => state.errorMessage !== null
    })
  }
};
</script>

<style>
</style>
