<template>
  <div>
    <e-select>
      <select
        id="content-type"
        :value="contentType"
        class="e-select e-select-inline"
        @change="selectContentType($event.target.value)">
        <option
          v-for="option in contentTypeOptions"
          :value="option.id"
          :key="option.id">{{ option.label }}</option>
      </select>
    </e-select>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ContentType from '../../common/content-types';
import Action from '../store/action-types';

export const contentTypeOptions = [
  {
    id: ContentType.custom,
    label: 'custom'
  },
  {
    id: ContentType.json,
    label: 'application/json'
  },
  {
    id: ContentType.text,
    label: 'text/plain'
  }
];

export default {
  name: 'ContentTypeSelector',
  data() {
    return {
      contentTypeOptions
    };
  },
  computed: {
    ...mapState({
      contentType: state => state.request.contentType
    })
  },
  methods: {
    ...mapActions([Action.selectContentType])
  }
};
</script>

<style scoped>
</style>
