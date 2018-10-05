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
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Action from '../store/action-types';

export default {
  name: 'RequestEditor',
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
