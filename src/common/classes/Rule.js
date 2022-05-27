export default class Rule {
  constructor(data) {
    this.title = 'Правило'
    this.description = ''
    this.type = 'list'
    this.conditions = []
    this.dir = null
    this.dirColumn = ''
    Object.assign(this, data)
  }

  checkComponent(id) {
    return this.conditions.some(el => el.components.includes(id) && !el.isEmpty)
  }
}