import { fromCmToPx } from '@/common/utils'
import Component from './Component'

export default class TableCell extends Component {
  constructor(data) {
    super(data)
    this.minWidth = 0
    this.paddings = [0.2, 0.2, 0.2, 0.2]
    this.type = 'tableCell'
    Object.assign(this, data)
  }

  updateParentCells(width) {
    if (this.minWidth >= width) return
    this.table.getColumn(this.x).forEach(el => el.setInnerWidth(width))
    const cCell = this.closestTableCell
    if (!cCell) return
    if (cCell.minWidth < this.table.outerWidth) {
      cCell.updateParentCells(this.table.outerWidth)
    }
  }

  setInnerWidth(width) {
    const { paddingsPx } = this
    this.minWidth = width + paddingsPx[1] + paddingsPx[3] + 5
  }

  get x() {
    return this.parent.components.indexOf(this)
  }

  get y() {
    return this.parent.y
  }

  get table() {
    return this.parent.parent
  }

  get borders() {
    const { bVertical, bHorizontal } = this.table
    const { x, y } = this
    return {
      left: bVertical.some(el => el.x === x && el.y === y),
      right: bVertical.some(el => el.x === x + 1 && el.y === y),
      top: bHorizontal.some(el => el.x === x && el.y === y),
      bottom: bHorizontal.some(el => el.x === x && el.y === y + 1)
    }
  }

  get relativePos() {
    const row = this.parent
    const { relativePos, innerMeasures } = row
    const rowWidth = innerMeasures.width
    const prevWidth = row.components.slice(0, this.x).reduce((a, b) => a + b.minWidth, 0)
    return {
      left: relativePos.left + prevWidth + 2,
      right: relativePos.right + (rowWidth - this.minWidth - prevWidth) - 2
    }
  }

  get isPrettyColumn() {
    const cells = this.table.components.map(el => el.components[this.x]).map(el => el.minWidth)
    return cells.every(el => el === cells[0])
  }

  get sameWidthCells() {
    const cells = this.table.components.map(el => el.components[this.x])
    return cells.filter(el => el.minWidth === this.minWidth)
  }

  get outerWidth() {
    return Math.max(this.minWidth, fromCmToPx(1))
  }
}