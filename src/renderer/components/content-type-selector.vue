<template>
  <div>
    <select
      id="content-type"
      :value="contentType"
      @input="selectContentType($event.target.value)">
      <option
        v-for="option in contentTypeOptions"
        :value="option.id"
        :key="option.id">{{ option.label }}</option>
    </select>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ContentType from '../../common/content-types';
import Action from '../store/action-types';

export const contentTypeOptions = [
  {
    id: ContentType.custom,
    label: 'Custom'
  },
  {
    id: ContentType.json,
    label: 'JSON'
  },
  {
    id: ContentType.text,
    label: 'Text'
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
