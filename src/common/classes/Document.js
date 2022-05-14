import Component from './Component'
import { formats } from '@/common/defaults'
import { fromCmToPx } from '@/common/utils'

export default class Document extends Component {
  constructor(data) {
    super()
    this.paddings = [1, 1, 1, 1]
    this.format = formats.a4
    this.width = fromCmToPx(formats.a4.width)
    Object.assign(this, data)
  }

  get pageMeasures() {
    const { width, height } = this.format
    return {
      width: fromCmToPx(width),
      height: fromCmToPx(height)
    }
  }
}