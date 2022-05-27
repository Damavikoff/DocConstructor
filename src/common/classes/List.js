import Component from './Component'

export default class List extends Component {
  constructor(data) {
    super(data)
    this.type = 'list'
    this.isEditable = true
    this.isEnumerated = false
    this.startsWith = '1'
    Object.assign(this, data)
  }

  get leadingChunk() {
    const match = this.startsWith.match(/^.*[^\d]/)
    return match ? match[0] : ''
  }

  get maskArray() {
    return this.startsWith.replace()
  }

  get incerementor() {
    const value = this.startsWith.replace(/^.*[^\d]/, '')
    return value.length ? Number(value) : 1
  }
}