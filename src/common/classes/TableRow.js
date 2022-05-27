import Component from './Component'

export default class TableRow extends Component {
  constructor(data) {
    super(data)
    this.minHeight = 0
    this.type = 'tableRow'
    Object.assign(this, data)
  }

  get y() {
    return this.parent.components.indexOf(this)
  }
}