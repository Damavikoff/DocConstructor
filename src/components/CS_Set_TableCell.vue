<template>
  <div class="ui basic fitted segment" :class="outClasses">
    <div class="slightly relaxed flex">
      <div class="ui mini horizontal divider fluid header" :class="{grey: !active}">
        <i class="th large icon"></i>
        <div class="content">Ячейка</div>
      </div>
    </div>
    <div class="ui tiny form">
      <div class="field">
        <div class="ui tiny grey header">
          <div class="content">Отступы</div>
        </div>
        <div class="content">
          <div class="four fields">
            <div class="field">
              <label>Сверху</label>
              <input type="text" placeholder="..." v-model.lazy="paddingTop" />
            </div>
            <div class="field">
              <label>Снизу</label>
              <input type="text" placeholder="..." v-model.lazy="paddingBottom" />
            </div>
            <div class="field">
              <label>Справа</label>
              <input type="text" placeholder="..." v-model.lazy="paddingRight" />
            </div>
            <div class="field">
              <label>Слева</label>
              <input type="text" placeholder="..." v-model.lazy="paddingLeft" />
            </div>
          </div>
        </div>
      </div>
      <div class="fields">
        <div class="field">
          <div class="sh button" @click="setOuterBorders">
            <img src="@/assets/img/i_border_outer.svg" alt="border_outer" />
          </div>
          <div class="sh button" @click="setNoneBorders">
            <img src="@/assets/img/i_border_none.svg" alt="border_none" />
          </div>
          <div class="sh button" @click="setSideBorder('top')">
            <img src="@/assets/img/i_border_top.svg" alt="border_top" />
          </div>
          <div class="sh button" @click="setSideBorder('right')">
            <img src="@/assets/img/i_border_right.svg" alt="border_right" />
          </div>
          <div class="sh button" @click="setSideBorder('bottom')">
            <img src="@/assets/img/i_border_bottom.svg" alt="border_bottom" />
          </div>
          <div class="sh button" @click="setSideBorder('left')">
            <img src="@/assets/img/i_border_left.svg" alt="border_left" />
          </div>
        </div>
        <div class="field">
          <div class="sh button" @click="addColumn(true)">
            <img src="@/assets/img/i_col_before.svg" alt="col_before" />
          </div>
          <div class="sh button" @click="addColumn()">
            <img src="@/assets/img/i_col_after.svg" alt="col_after" />
          </div>
          <div class="sh button" @click="addRow(true)">
            <img src="@/assets/img/i_row_above.svg" alt="row_above" />
          </div>
          <div class="sh button" @click="addRow()">
            <img src="@/assets/img/i_row_below.svg" alt="row_below" />
          </div>
        </div>
        <div class="field">
          <div class="sh button" @click="removeRow()" :class="{disabled: isOnlyRow}">
            <img src="@/assets/img/i_row_remove.svg" alt="row_remove" />
          </div>
          <div class="sh button" @click="removeColumn()" :class="{disabled: isOnlyColumn}">
            <img src="@/assets/img/i_col_remove.svg" alt="col_remove" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import CParagraph from '@/common/classes/Paragraph'
import CTableRow from '@/common/classes/TableRow'
import CTableCell from '@/common/classes/TableCell'

export default {
  name: 'CsSetTableCell',
  inject: ['setActiveNode'],
  props: {
    data: Object,
    active: Boolean
  },
  methods: {
    remove() {
      this.setActiveNode(null)
      this.data.parent.components = this.data.parent.components.filter(el => el !== this.data)
    },
    removeRow() {
      if (this.isOnlyRow) return
      this.setActiveNode(null)
      const { y, table } = this.data
      const { bVertical, bHorizontal } = table
      table.components.splice(y, 1)
      table.bVertical = bVertical.filter(el => el.y !== y)
      table.bHorizontal = bHorizontal.filter(el => el.y !== y && el.y !== y + 1)
    },
    removeColumn() {
      if (this.isOnlyColumn) return
      this.setActiveNode(null)
      const { x, table } = this.data
      const { bVertical, bHorizontal } = table
      table.components.forEach(el => {
        el.components.splice(x, 1)
      })
      table.bVertical = bVertical.filter(el => el.x !== x && el.x !== x + 1)
      table.bHorizontal = bHorizontal.filter(el => el.y !== y)
    },
    addRow(before = false) {
      const { table, y } = this.data
      const { components:rows, bVertical, bHorizontal } = table
      const row = new CTableRow({parent: table})
      const cells = rows[y].components.map((el, x) => {
        const { minWidth, paddings } = el
        const cell = new CTableCell({
          parent: row,
          minWidth,
          paddings: [...paddings]
        })
        const paragraph = new CParagraph({parent: cell, indent: 0})
        cell.components = [paragraph]
        return cell
      })
      row.components = cells
      table.components.splice(before ? y : y + 1, 0, row)
      if (before) {
        bHorizontal.forEach(el => el.y >= (before ? y : y + 1) && el.y++)
        bVertical.forEach(el => el.y >= (before ? y : y + 1) && el.y++)
      }
    },
    addColumn(before = false) {
      const { table, x } = this.data
      const { components:rows, bVertical, bHorizontal } = table
      const column = table.getColumn(x)
      const cells = column.map((el, y) => {
        const { minWidth, paddings } = el
        const cell = new CTableCell({
          parent: rows[y],
          minWidth,
          paddings: [...paddings]
        })
        const paragraph = new CParagraph({parent: cell, indent: 0})
        cell.components = [paragraph]
        return cell
      })
      rows.forEach((el, y) => {
        el.components.splice(before ? x : x + 1, 0, cells[y])
      })
      if (before) {
        bHorizontal.forEach(el => el.x >= (before ? x : x + 1) && el.x++)
        bVertical.forEach(el => el.x >= (before ? x : x + 1) && el.x++)
      }
    },
    getParsedNumber(value) {
      const parsed = Number(value)
      return parsed ? parsed : 0
    },
    setNoneBorders() {
      const { table, x, y } = this.data
      const { bVertical, bHorizontal } = table
      table.bHorizontal = bHorizontal.filter(el => !(el.x === x && (el.y === y || el.y === y + 1)))
      table.bVertical = bVertical.filter(el => !(el.y === y && (el.x === x || el.x === x + 1)))
    },
    hasBorder(type) {
      const { table, x, y } = this.data
      const { bVertical, bHorizontal } = table
      switch (type) {
        case 'top':
          return bHorizontal.some(el => el.x === x && el.y === y)
        case 'right':
          return bVertical.some(el => el.x === x + 1 && el.y === y)
        case 'bottom':
          return bHorizontal.some(el => el.x === x && el.y === y + 1)
        case 'left':
          return bVertical.some(el => el.x === x && el.y === y)
        default:
          break;
      }
    },
    setSideBorder(type) {
      const { table, x, y } = this.data
      const { bVertical, bHorizontal } = table
      if (this.hasBorder(type)) return
      switch (type) {
        case 'top':
          return bHorizontal.push({x, y})
        case 'right':
          return bVertical.push({x: x + 1, y})
        case 'bottom':
          return bHorizontal.push({x, y: y + 1})
        case 'left':
          return bVertical.push({x, y})
        default:
          break;
      }
    },
    setOuterBorders() {
      this.setSideBorder('top')
      this.setSideBorder('right')
      this.setSideBorder('bottom')
      this.setSideBorder('left')
    }
  },
  computed: {
    isOnlyRow() {
      return this.data.table.components.length < 2
    },
    isOnlyColumn() {
      return this.data.table.columnCount < 2
    },
    outClasses() {
      return {
        active: this.active
      }
    },
    paddingLeft: {
      get() {
        return this.data.paddings[3]
      },
      set(value) {
        this.data.paddings[3] = this.getParsedNumber(value)
      }
    },
    paddingRight: {
      get() {
        return this.data.paddings[1]
      },
      set(value) {
        this.data.paddings[1] = this.getParsedNumber(value)
      }
    },
    paddingTop: {
      get() {
        return this.data.paddings[0]
      },
      set(value) {
        this.data.paddings[0] = this.getParsedNumber(value)
      }
    },
    paddingBottom: {
      get() {
        return this.data.paddings[2]
      },
      set(value) {
        this.data.paddings[2] = this.getParsedNumber(value)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .segment {
    &.active {
      padding-left: 1em !important;
      border-left: 2px solid #2185d0 !important;
    }
    >.flex {
      >i {
        font-size: 1.3em;
      }
    }
  }
  .divider.header {
    margin-bottom: 0.5em !important;
  }
  .field {
    >.content {
      padding: 0 .8em;
    }
    >.header {
      margin-bottom: .8em;
    }
    >input {
      padding: 0.4em 0.5em !important;
    }
    >.dropdown {
      padding-top: 0.5em !important;
      padding-left: 0.5em !important;
      padding-bottom: 0.5em !important;
      min-height: auto !important;
      >i {
        padding: 0.65em 0.6em !important;
      }
    }
  }
</style>
