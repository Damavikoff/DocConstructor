import Component from './Component'
import { formats } from '@/common/defaults'
import { fromCmToPx } from '@/common/utils'

export default class Document extends Component {
  constructor(data) {
    super()
    this.paddings = [1, 1, 1, 1]
    this.format = formats.a4
    this.title = 'Документ'
    this.description = 'Описание документа'
    this.width = fromCmToPx(formats.a4.width)
    this.rules = []
    Object.assign(this, data)
  }

  get pageMeasures() {
    const { width, height } = this.format
    return {
      width: fromCmToPx(width),
      height: fromCmToPx(height)
    }
  }

  getIdentifiers(component) {
    const result = [component.id]
    return result.concat(component.components.map(el => this.getIdentifiers(el)))
  }

  get identifiers() {
    return getComponents(this)
  }
}