<template>
  <div class="table-cell" :style="outStyles">
    <div class="border vertical left" :class="borders.left" @mousedown.stop="handleMouseDown($event, data.x - 1, true)"></div>
    <div class="border vertical right" :class="borders.right" @mousedown.stop="handleMouseDown($event, data.x, true)"></div>
    <div class="border horizontal top" :class="borders.top" @mousedown.stop="handleMouseDown($event, data.y - 1)"></div>
    <div class="border horizontal bottom" :class="borders.bottom" @mousedown.stop="handleMouseDown($event, data.y)"></div>
    <div class="content">
      <template v-for="(item, key) in data.components">
        <CsParagraph :data="item" :key="item.id" v-if="item.type === 'paragraph'" />
        <CsFragment :data="item" :key="item.id" v-else-if="item.type === 'fragment'" />
        <CsImage :data="item" :key="item.id" v-else-if="item.type === 'image'" />
        <CsList :data="item" :key="item.id" v-else-if="item.type === 'list'" />
        <CsTable :data="item" :key="item.id" v-else-if="item.type === 'table'" />
      </template>
    </div>
  </div>
</template>

<script>
import CsParagraph from './CS_Paragraph.vue';
import CsImage from './CS_Image.vue';
import CsFragment from './CS_Fragment.vue';
import CsList from './CS_List.vue';
import CsTable from './CS_Table.vue';

export default {
  name: 'CsTableCell',
  components: {
    CsParagraph,
    CsImage,
    CsFragment,
    CsList,
    CsTable
  },
  props: {
    data: Object,
  },
  inject: ['getActiveNode', 'setActiveNode'],
  data() {
    return {
      resize: {
        isActive: false,
        isVertical: false,
        axis: 0,
        startPos: 0
      }
    }
  },
  mounted() {
    document.addEventListener('mouseup', this.handleMouseUp, false)
    document.addEventListener('mousemove', this.handleMouseMove, false)
  },
  beforeUnmount() {
    document.removeEventListener('mouseup', this.handleMouseUp, false)
    document.removeEventListener('mousemove', this.handleMouseMove, false)
  },
  computed: {
    isActive() {
      return this.data === this.getActiveNode()
    },
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
  },
  methods: {
    getColumnCells(x) {
      return this.data.table.components.map(el => el.components[x])
    },
    setRowHeight(height) {
      const { axis:y } = this.resize
      const row = this.data.table.components[y]
      row.minHeight = Math.max(row.minHeight + height, 30)
    },
    setCellsWidth(width) {
      const { axis:x } = this.resize
      const cells = this.getColumnCells(x)
      const minWidth = cells[this.data.y].minWidth
      const sameWidthCells = cells.filter(el => el.minWidth === minWidth)
      sameWidthCells.forEach(el => { el.minWidth = Math.max(el.minWidth + width, 50) })
    },
    handleMouseMove(event) {
      const { isActive, startPos, isVertical, axis } = this.resize
      if (!isActive || axis < 0) return
      const { pageX, pageY } = event
      if (isVertical) {
        const width = pageX - startPos
        this.resize.startPos = pageX
        this.setCellsWidth(width)
        return
      }
      const height = pageY - startPos
      this.resize.startPos = pageY
      this.setRowHeight(height)
    },
    handleMouseDown(event, axis, isVertical = false) {
      event.preventDefault()
      const { pageX, pageY } = event
      this.resize.startPos = isVertical ? pageX : pageY
      this.resize.isVertical = isVertical
      this.resize.axis = axis
      this.resize.isActive = true
    },
    handleMouseUp() {
      this.resize.isActive = false
    }
  }
};
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
    background: #eaeaea;
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
