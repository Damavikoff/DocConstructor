<template>
  <div class="table" :style="outStyles">
    <div class="content">
      <VwTableRow v-for="(item, key) in data.components" :data="item" :key="item.id" />
    </div>
  </div>
</template>

<script>
import VwTableRow from './VW_TableRow.vue';

export default {
  name: 'CsTable',
  components: {
    VwTableRow
  },
  props: {
    data: Object
  },
  computed: {
    outStyles() {
      const { paddingsPx } = this.data
      return {
        'padding': paddingsPx.map(el => `${el}px`).join(' ')
      }
    }
  },
};
</script>

<style lang="scss" scoped>
  .table {
    padding: 1px;
    .content {
      width: min-content;
      padding: 1px;
    }
  }
</style>
