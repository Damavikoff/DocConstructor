import { uuidv4, fromCmToPx } from '@/common/utils'

export default class Component {
  constructor(data) {
    this.settings = {
      paddings: [0, 0, 0, 0]
    }
    this.id = uuidv4()
    this.parent = data?.parent ?? null
    this.components = []
    this.width = this.parent ? this.parent.innerMeasures.width : 0
    this.height = 0
  }

  setMeasures(width, height) {
    this.width = width
    this.height = height
  }

  setInnerHeight(height) {
    const { paddings } = this.settings
    this.height = height + paddings[0] + paddings[2]
  }

  get innerMeasures() {
    const { width, height } = this
    const { paddings } = this
    return {
      width: width - paddings[1] - paddings[3],
      height: height - this.paddings[0] - paddings[2]
    }
  }

  get measures() {
    return {
      width: this.width,
      height: this.components ? this.components.reduce((a, b) => a + b.height, 0) : this.height
    }
  }

  get paddings() {
    return this.settings.paddings.map(el => fromCmToPx(el))
  }
}