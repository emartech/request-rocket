<template>
  <div class="e-accordion__content">
    <div class="e-field">
      <content-type-selector/>
    </div>
    <code-editor
      :code="body"
      :type="contentType"
      @input="setRequestBody"/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Action from '../store/action-types';
import CodeEditor from './code-editor';
import ContentTypeSelector from './content-type-selector';

export default {
  name: 'RequestBodyEditor',
  components: { ContentTypeSelector, CodeEditor },
  computed: {
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
