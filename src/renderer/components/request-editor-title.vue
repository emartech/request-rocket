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
            reset settings
          </a>
          <a
            id="save-as"
            class="e-dropdown__item"
            @click="saveToFile">
            <e-icon
              icon="ac-icon_save"
              type="table"/>
            save as...
          </a>
        </div>
      </e-dropdown>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Action from '@/store/action-types';

export default {
  name: 'RequestEditorTitle',
  methods: {
    ...mapActions(['resetState', Action.saveToFile])
  }
};
</script>

<style>
</style>
