<template>
  <div>
    <div
      v-if="hasInfoMessage"
      id="info-message"
      class="e-alert e-alert-fixed e-alert-withicon e-alert-info"
      style="top: 0">
      <span class="e-alert__icon">
        <e-icon icon="e-info-circle" />
      </span>
      <div>
        <span>{{ infoMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { isEmpty } from 'ramda';
import Action from '../store/action-types';

export default {
  name: 'InfoMessage',
  data() {
    return {
      timer: null
    };
  },
  computed: {
    ...mapState({
      hasInfoMessage: state => !isEmpty(state.infoMessage),
      infoMessage: state => state.infoMessage
    })
  },
  watch: {
    infoMessage(newValue) {
      clearTimeout(this.timer);

      if (newValue !== '') {
        this.timer = setTimeout(() => {
          this.clearInfoMessage();
        }, 5000);
      }
    }
  },
  methods: {
    ...mapActions([Action.clearInfoMessage])
  }
};
</script>
