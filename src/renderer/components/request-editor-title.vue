<template>
  <div class="e-fullheight__header">
    <h2>Request</h2>

    <div class="e-fullheight__actions">

      <e-dropdown
        data-markup-content="<e-icon icon='cog'/>"
        data-markup-class="e-btn e-btn-dropdown"
        data-autoclose="true">
        <div class="e-dropdown__content">
          <a
            class="e-dropdown__item reset-state"
            @click="resetState">
            <e-icon
              icon="e-reset"
              type="table"/>
            Reset settings
          </a>
          <a
            id="load-file"
            class="e-dropdown__item"
            @click="loadFile">
            <e-icon
              icon="folder-open"
              type="table"/>
            Open...
          </a>
          <a
            id="save-as"
            class="e-dropdown__item"
            @click="saveToFile">
            <e-icon
              icon="ac-icon_save"
              type="table"/>
            Save as...
          </a>
        </div>
      </e-dropdown>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { ipcRenderer } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import Channels from '../../common/ipc-channels';
import FileContent from '../../common/file-content';

export default {
  name: 'RequestEditorTitle',
  methods: {
    ...mapActions(['resetState']),
    saveToFile() {
      const fileContent = FileContent.toJson(this.$store.state);
      ipcRenderer.send(Channels.FILE_SAVE, fileContent);
    },
    loadFile() {
      ipcRenderer.send(Channels.FILE_LOAD);
    }
  }
};
</script>

<style>
</style>
