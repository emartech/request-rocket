<template>
  <div class="e-accordion__content">
    <div class="e-field">
      <content-type-selector/>
    </div>
    <div class="e-box e-box-no_margin e-box-charts">
      <code-editor
        :code="body"
        :type="contentType"
        @input="setRequestBody"/>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import Action from '../store/action-types';
import CodeEditor from './code-editor';
import ContentTypeSelector from './content-type-selector';

export default {
  name: 'RequestBodyEditor',
  components: { ContentTypeSelector, CodeEditor },
  computed: {
    ...mapGetters(['isNetworkAvailable']),
    ...mapState({
      body: state => state.request.body,
      contentType: state => state.request.contentType
    })
  },
  methods: {
    ...mapActions([Action.sendRequest, Action.setUrl, Action.selectHttpMethod, Action.setRequestBody])
  }
};
</script>

<style>
</style>
