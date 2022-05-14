import Component from './Component'

export default class Fragment extends Component {
  constructor(data) {
    super(data)
    this.type = 'fragment'
    Object.assign(this, data)
  }
}