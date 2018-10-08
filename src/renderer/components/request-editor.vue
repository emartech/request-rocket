<template>
  <div>
    <input
      id="request-editor-url-field"
      :value="url"
      type="text"
      @input="setUrl($event.target.value)">
    <button
      id="request-editor-send-button"
      type="button"
      @click="sendRequest">Send</button>
    <auth-editor/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Action from '../store/action-types';
import AuthEditor from './auth-editor';

export default {
  name: 'RequestEditor',
  components: { AuthEditor },
  computed: mapState({
    url: state => state.request.url,
  }),
  methods: {
    ...mapActions([Action.sendRequest, Action.setUrl]),
  },
};
</script>

<style>
</style>
