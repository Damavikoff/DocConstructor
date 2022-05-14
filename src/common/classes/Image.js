import Component from './Component'

export default class Image extends Component {
  constructor(data) {
    super(data)
    this.type = 'image'
    this.imageData = null,
    this.preserveScale = true
    Object.assign(this, data)
  }

  get innerMeasures() {
    return {
      width: this.width,
      height: this.height
    }
  }

  get measures() {
    const { paddingsPx } = this
    return {
      width: this.width + paddingsPx[1] + paddingsPx[3],
      height: this.height + paddingsPx[0] + paddingsPx[2]
    }
  }
}