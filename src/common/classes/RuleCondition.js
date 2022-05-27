export default class RuleCondition {
  constructor(data) {
    this.title = 'Условие'
    this.components = []
    Object.assign(this, data)
  }

  get isEmpty() {
    return this.title.trim().length === 0
  }
}