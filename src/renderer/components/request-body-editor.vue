<template>
  <div class="e-accordion">
    <input
      id="request-body-editor-accordion"
      :disabled="!isRequestBodyEditAvailable"
      :checked="isRequestBodyEditAvailable"
      type="checkbox"
      name="accordion-checkbox">
    <label
      class="e-accordion__title"
      for="request-body-editor-accordion">
      Accordion 1
    </label>
    <div
      class="e-accordion__content">
      <content-type-selector/>
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
    ...mapGetters(['isNetworkAvailable', 'isRequestBodyEditAvailable']),
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
