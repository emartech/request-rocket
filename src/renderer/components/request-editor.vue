<template>
  <div class="e-box e-box-simple">
    <div>
      <url-group/>
    </div>
    <div>
      <header-editor/>
    </div>
    <div>
      <auth-editor/>
    </div>
    <div v-if="isRequestBodyEditAvailable">
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
import AuthEditor from './auth-editor';
import CodeEditor from './code-editor';
import ContentTypeSelector from './content-type-selector';
import UrlGroup from './url-group';
import HeaderEditor from './header-editor';

export default {
  name: 'RequestEditor',
  components: { UrlGroup, ContentTypeSelector, CodeEditor, AuthEditor, HeaderEditor },
  computed: {
    ...mapGetters(['isNetworkAvailable', 'isRequestBodyEditAvailable']),
    ...mapState({
      url: state => state.request.url,
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
