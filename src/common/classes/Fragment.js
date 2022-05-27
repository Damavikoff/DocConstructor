import Component from './Component'

export default class Fragment extends Component {
  constructor(data) {
    super(data)
    this.type = 'fragment'
    this.paddings = [ 0, 0.5, 0, 0.5]
    Object.assign(this, data)
  }
}