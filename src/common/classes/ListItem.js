import Paragraph from './Paragraph'

export default class ListItem extends Paragraph {
  constructor(data) {
    super(data)
    this.type = 'listItem'
    this.isCustom = false
    this.align = 'justify'
    Object.assign(this, data)
  }

  get order() {
    const index = this.parent.components.indexOf(this)
    const { leadingChunk, incerementor } = this.parent
    return leadingChunk + ( incerementor + index ) + '.'
  }

  get isEditable() {
    return this.isCustom
  }
}