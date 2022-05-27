import { uuidv4 } from '@/common/utils'

export default class Field {
  constructor(data) {
    this.id = uuidv4()
    this.type = 'field'
    this.bold = false
    this.italic = false
    this.underline = false
    this.title = 'Поле'
    this.description = ''
    this.position = 0
    this.parent = null
    Object.assign(this, data)
    this.isDirectory = false
    this.dir = ''
    this.dirColumn = ''
    this.value = ''
    this.fontSize = this.parent?.fontSize
    this.fontFamily = this.parent?.fontFamily
    this.fontColor = this.parent?.fontColor
  }

  get displayValue() {
    if (!this.value.trim()) {
      return this.title.trim() ? `[${this.title}]` : `[Поле]`
    }
    return this.value
  }

}