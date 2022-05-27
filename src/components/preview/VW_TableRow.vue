<template>
  <div class="table-row">
    <div class="content" :style="outStyles">
      <VwTableCell  v-for="(item, key) in data.components" :data="item" :key="item.id" />
    </div>
  </div>
</template>

<script>
import VwTableCell from './VW_TableCell.vue';

export default {
  name: 'VwTableRow',
  components: {
    VwTableCell
  },
  props: {
    data: Object
  },
  computed: {
    outStyles() {
      const { minHeight } = this.data
      return {
        'min-height': `${minHeight}px`
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .table-row {
    .content {
      display: flex;
    }
    +.table-row {
      margin-top: 1px;
    }
  }
</style>
