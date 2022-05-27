<template>
  <div class="table-cell" :style="outStyles">
    <div class="border vertical left" :class="borders.left"></div>
    <div class="border vertical right" :class="borders.right"></div>
    <div class="border horizontal top" :class="borders.top"></div>
    <div class="border horizontal bottom" :class="borders.bottom"></div>
    <div class="content">
      <template v-for="(item, key) in data.components">
        <VwParagraph :data="item" :key="item.id" v-if="item.type === 'paragraph'" />
        <VwFragment :data="item" :key="item.id" v-else-if="item.type === 'fragment'" />
        <VwImage :data="item" :key="item.id" v-else-if="item.type === 'image'" />
        <VwList :data="item" :key="item.id" v-else-if="item.type === 'list'" />
        <VwTable :data="item" :key="item.id" v-else-if="item.type === 'table'" />
      </template>
    </div>
  </div>
</template>

<script>
import VwParagraph from './VW_Paragraph.vue';
import VwImage from './VW_Image.vue';
import VwFragment from './VW_Fragment.vue';
import VwList from './VW_List.vue';
import VwTable from './VW_Table.vue';

export default {
  name: 'CsTableCell',
  components: {
    VwParagraph,
    VwImage,
    VwFragment,
    VwList,
    VwTable
  },
  props: {
    data: Object,
  },
  computed: {
    outStyles() {
      const { paddingsPx } = this.data
      return {
        'padding': paddingsPx.map(el => `${el}px`).join(' ')
      }
    },
    borders() {
      const borders = this.data.borders
      const result = Object.keys(borders).map(el => {
        return [el, {active: borders[el]}]
      })
      return Object.fromEntries(result)
    }
  }
}
</script>

<style lang="scss" scoped>
  .table-cell {
    //margin: 1px
    +.table-cell {
      margin-left: 1px;
    }
    >.content {
      overflow-x: clip;
    }
  }
  .border {
    position: absolute;
    &.active {
      background: black;
    }
    &.vertical {
      width: 1px;
      height: calc(100% + 2px);
      &::before {
        width: 3px;
        height: 100%;
        position: absolute;
        cursor: e-resize;
        transform: translateX(-1px);
      }
    }
    &.horizontal {
      height: 1px;
      width: calc(100% + 2px);
      &::before {
        width: 100%;
        height: 3px;
        position: absolute;
        cursor: n-resize;
        transform: translateY(-1px);
      }
    }
    &.top {
      left: -1px;
      top: -1px;
    }
    &.bottom {
      left: -1px;
      bottom: -1px;
    }
    &.left {
      left: -1px;
      top: -1px;
    }
    &.right {
      right: -1px;
      top: -1px;
    }
    &::before {
      content: '';
      position: absolute;
      user-select: none;
      left: 0;
      top: 0;
    }
  }
</style>
