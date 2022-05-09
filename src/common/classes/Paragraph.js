import Component from './Component'
import { fromPtToPx } from '@/common/utils'

export default class Paragraph extends Component {
  constructor(data) {
    super(data)
    this.settings = {
      ...this.settings,
      lineHeight: 1,
      bold: [],
      italic: [],
      underline: [],
      align: 'left',
      fontFamily: 'Monospace',
      fontSize: 14,
      text: ''
    }
    this.type = 'paragraph'
    Object.assign(this, data)
  }

  get fontSizePx() {
    return fromPtToPx(this.settings.fontSize)
  }
}