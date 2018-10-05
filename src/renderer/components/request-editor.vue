<template>
    <div>
        <input type="text" id="request-editor-url-field" :value="url" @input="setUrl($event.target.value)">
        <button type="button" id="request-editor-send-button" @click="sendRequest">Send</button>
    </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import Action from '../store/action-types';

  export default {
    name: 'request-editor',
    computed: {
      ...mapState(['url']),
    },
    methods: {
      ...mapActions([
        Action.sendRequest,
        Action.setUrl,
      ]),
    },
  };</script>

<style>
</style>
