import Component from './Component'

export default class Table extends Component {
  constructor(data) {
    super(data)
    this.bVertical = []
    this.bHorizontal = []
    this.type = 'table'
    Object.assign(this, data)
  }

  getColumn(x) {
    return this.components.map(el => el.components[x])
  }

  get columnCount() {
    return this.components[0]?.components?.length ?? 0
  }

  get outerWidth() {
    return this.components[0].components.reduce((a, b) => a + b.outerWidth, 0)
  }

  get relativePos() {
    const { relativePos, innerMeasures, paddingsPx } = this.parent
    return {
      left: relativePos.left + paddingsPx[3],
      right: Math.max(innerMeasures.width - this.outerWidth + relativePos.right + paddingsPx[1], relativePos.right)
    }
  }
}