<template>
  <div>
    <e-select
      id="content-type"
      inline=""
      @change="selectContentType($event.target.value)">
      <e-select-option
        v-for="option in contentTypeOptions"
        :selected="contentType === option.id"
        :value="option.id"
        :key="option.id">{{ option.label }}
      </e-select-option>
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
