<template>
  <div class="ui basic fitted segment" :class="outClasses">
    <div class="slightly relaxed flex">
      <div class="ui mini horizontal divider fluid header" :class="{grey: !active}">
        <i class="th icon"></i>
        <div class="content">Таблица</div>
      </div>
      <i class="grey list link icon" title="Правила" @click="setComponentRules(data)"></i>
      <i class="grey trash alternate outline link icon" title="Удалить" @click="remove"></i>
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
              <label>Слева</label>
              <input type="text" placeholder="..." v-model.lazy="paddingLeft" />
            </div>
          </div>
        </div>
      </div>
      <div class="fields">
        <div class="field">
          <div class="sh button" @click="setAllBorders">
            <img src="@/assets/img/i_border_all.svg" alt="border_all" />
          </div>
          <div class="sh button" @click="setOuterBorders">
            <img src="@/assets/img/i_border_outer.svg" alt="border_outer" />
          </div>
          <div class="sh button" @click="setInnerBorders">
            <img src="@/assets/img/i_border_inner.svg" alt="border_inner" />
          </div>
          <div class="sh button" @click="setNoneBorders">
            <img src="@/assets/img/i_border_none.svg" alt="border_none" />
          </div>
        </div>
        <div class="field">
          <div class="sh button" @click="addColumn(true)">
            <img src="@/assets/img/i_col_before.svg" alt="col_before" />
          </div>
          <div class="sh button" @click="addColumn()">
            <img src="@/assets/img/i_col_after.svg" alt="col_after" />
          </div>
        </div>
        <div class="field">
          <div class="sh button" @click="addRow(true)">
            <img src="@/assets/img/i_row_above.svg" alt="row_above" />
          </div>
          <div class="sh button" @click="addRow()">
            <img src="@/assets/img/i_row_below.svg" alt="row_below" />
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
  name: 'CsSetTable',
  inject: ['setActiveNode', 'setComponentRules'],
  props: {
    data: Object,
    active: Boolean
  },
  methods: {
    remove() {
      this.setActiveNode(null)
      this.data.parent.components = this.data.parent.components.filter(el => el !== this.data)
    },
    addRow(before = false) {
      const { components:rows, bVertical, bHorizontal } = this.data
      const y = before ? 0 : rows.length - 1
      const row = new CTableRow({parent: this.data})
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
      this.data.components[before ? 'unshift' : 'push'](row)
      if (before) {
        bHorizontal.forEach(el => el.y++)
        bVertical.forEach(el => el.y++)
      }
    },
    addColumn(before = false) {
      const { components:rows, bVertical, bHorizontal, columnCount } = this.data
      const x = before ? 0 : columnCount - 1
      const column = this.data.getColumn(x)
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
        el.components[before ? 'unshift' : 'push'](cells[y])
      })
      if (before) {
        bHorizontal.forEach(el => el.x++)
        bVertical.forEach(el => el.x++)
      }
    },
    getParsedNumber(value) {
      const parsed = Number(value)
      return parsed ? parsed : 0
    },
    setNoneBorders() {
      this.data.bVertical = []
      this.data.bHorizontal = []
    },
    setAllBorders() {
      this.setOuterBorders()
      this.setInnerBorders(false)
    },
    setOuterBorders(clear = true) {
      clear && this.setNoneBorders()
      const rows = this.data.components
      for (let y = 0; y < rows.length; y++) {
        const cells = rows[y].components
        for (let x = 0; x <= cells.length; x++) {
          if (!y) {
            this.data.bHorizontal.push({ x, y})
          }
          if (y === rows.length - 1) {
            this.data.bHorizontal.push({ x, y: y + 1 })
          }
          if (!x || x === cells.length) {
            this.data.bVertical.push({ x, y })
          }
        }
      }
    },
    setInnerBorders(clear = true) {
      clear && this.setNoneBorders()
      const rows = this.data.components
      for (let y = 0; y < rows.length; y++) {
        const cells = rows[y].components
        for (let x = 0; x < cells.length; x++) {
          if (y) {
            this.data.bHorizontal.push({ x, y})
          }
          if (x) {
            this.data.bVertical.push({ x, y })
          }
        }
      }
    }
  },
  computed: {
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
