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

  setMeasures(width, height) {
    this.width = width
    this.height = height
  }

  get relativePos() {
    let left = 0
    let right = 0
    let parent = this.parent
    while (parent) {
      const { paddingsPx } = parent
      left += paddingsPx[3]
      right += paddingsPx[1]
      parent = parent.parent
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

  get paddingsPx() {
    return this.paddings.map(el => fromCmToPx(el))
  }
}