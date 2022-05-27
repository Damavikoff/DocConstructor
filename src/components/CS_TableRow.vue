<template>
  <div class="table-row">
    <div class="content" :style="outStyles">
      <CsTableCell  v-for="(item, key) in data.components" :data="item" :key="item.id" />
    </div>
  </div>
</template>

<script>
import CsTableCell from './CS_TableCell.vue';

export default {
  name: 'CsTableRow',
  components: {
    CsTableCell
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
