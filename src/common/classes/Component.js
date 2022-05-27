import { uuidv4, fromCmToPx } from '@/common/utils'

export default class Component {
  constructor(data) {
    this.paddings = [0, 0, 0, 0]
    this.id = uuidv4()
    this.parent = data?.parent ?? null
    this.components = []
    this.width = 0
    this.height = 0
    this.marginTop = 0
    this.rules = []
  }

  remove() {
    this.parent.components = this.parent.components.filter(el => el !== this)
  }

  setMeasures(width, height) {
    this.width = width
    this.height = height
  }

  get relativePos() {
    let left = 0
    let right = 0
    if (this.parent) {
      const { relativePos, paddingsPx } = this.parent
      left = relativePos.left + paddingsPx[3]
      right = relativePos.right + paddingsPx[1]
    }
    
    return {
      left,
      right
    }
  }

  setInnerHeight(height) {
    const { paddingsPx } = this
    this.height = height + paddingsPx[0] + paddingsPx[2]
  }

  get innerMeasures() {
    const { outerWidth, height } = this
    const { paddingsPx } = this
    return {
      width: outerWidth - paddingsPx[1] - paddingsPx[3],
      height: height - this.paddingsPx[0] - paddingsPx[2]
    }
  }

  get outerWidth() {
    return this.parent ? this.parent.innerMeasures.width : this.width
  }

  get measures() {
    return {
      width: this.width,
      height: this.components ? this.components.reduce((a, b) => a + b.height + b.marginTop, 0) : this.height
    }
  }

  get index() {
    if (this.parent) return this.parent.components.indexOf(this)
    return 0
  }

  get paddingsPx() {
    return this.paddings.map(el => fromCmToPx(el))
  }

  getClosetParentElement(type) {
    let parent = this.parent
    while (parent) {
      if (parent.type === 'tableCell') return parent
      parent = parent.parent
    }
  }

  get closestTable() {
    return this.getClosetParentElement('table')
  }

  get closestTableCell() {
    return this.getClosetParentElement('tableCell')
  }

  get closestFragment() {
    return this.getClosetParentElement('fragment')
  }
}