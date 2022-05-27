import Component from './Component'
import { fromPtToPx, fromCmToPx } from '@/common/utils'

export default class Paragraph extends Component {
  constructor(data) {
    super(data)
    this.lineHeight = 1
    this.indent = 1
    this.rBold = []
    this.rItalic = []
    this.rUnderline = []
    this.rFontColor = []
    this.rFontFamily = []
    this.rFontSize = []
    this.align = 'left'
    this.fontColor = '#000000'
    this.fontFamily = 'Times'
    this.fontSize = 14
    this.text = ''
    this.caretPosition = 0
    this.caretBefore = true
    this.type = 'paragraph'
    Object.assign(this, data)
  }

  get isNotAlone() {
    return this.parent.components.some(el => el.type === this.type && el !== this)
  }

  get indentPx() {
    return fromCmToPx(this.indent)
  }

  get fontSizePx() {
    return fromPtToPx(this.fontSize)
  }

  setBold(range, uncheck) {
    this.setStyle('rBold', range, uncheck)
  }

  setValueStyle(type, range, value) {
    if (range.length === this.text.length) {
      if (type === 'rFontFamily') this.fontFamily = value
      else if (type === 'rFontColor') this.fontColor = value
      else if (type === 'rFontSize') this.fontSize = value
      this[type] = []
      return
    }
    const currentVal = this[type].find(el => el.value === value)
    if (currentVal) {
      currentVal.range = Array.from(new Set(currentVal.range.concat(range)))
    } else {
      this[type].push({value, range})
    }
    for (const typeVal of this[type]) {
      if (typeVal.value !== value) {
        typeVal.range = typeVal.range.filter(el => !range.includes(el))
      }
    }
  }

  setFontStyle(type, value) {
    this[type] = value
    this.components.forEach(el => el[type] = value)
    if (type === 'fontFamily') this.clearStyleValues('rFontFamily')
    else if (type === 'fontColor') this.clearStyleValues('rFontColor')
    else if (type === 'fontSize') this.clearStyleValues('rFontSize')
  }

  clearStyleValues(type) {
    this[type] = []
  }

  setStyle(type, range, uncheck) {
    if (uncheck) {
      this[type] = this[type].filter(el => !range.includes(el))
      return
    }
    this[type] = Array.from(new Set(this[type].concat(range)))
  }

  removeKey(forward = false) {
    if (!this.text.length && !forward) {
      const parent = this.parent
      if (this.index) {
        this.remove()
      }
      if (parent.type === 'list' && !parent.components.length) {
        parent.remove()
      }
    }
    let index = this.caretPosition
    if (forward && !this.caretBefore) {
      index++
    }
    if (!forward && this.caretBefore) {
      index--
    }
    
    this.removeShiftStyles(1, index, forward)
    if (!forward && index < 0) return
    if (forward && index === this.text.length) return
    if (!forward) {
      this.caretPosition = Math.max(this.caretPosition - 1, 0)
      if (!index && !this.caretBefore) this.caretBefore = true
    } else {
      if (this.caretBefore && this.caretPosition) {
        this.caretPosition--
        this.caretBefore = false
      }
    }
    this.text = this.text.slice(0, index) + this.text.slice(index + 1)
  }

  cutStyles(index) {
    this.rBold = this.rBold.filter(el => el < index)
    this.rItalic = this.rItalic.filter(el => el < index)
    this.rUnderline = this.rUnderline.filter(el => el < index)
    this.rFontColor.forEach(el => el.range = el.range.filter(val => val < index))
    this.rFontFamily.forEach(el => el.range = el.range.filter(val => val < index))
    this.rFontSize.forEach(el => el.range = el.range.filter(val => val < index))
  }

  removeShiftStyles(length, position, forward) {
    const isBefore = this.caretBefore
    if (isBefore && !forward || !isBefore && forward) {
      const pos = isBefore && !forward ? position + 1 : position
      this.components = this.components.filter(el => el.position !== pos)
    }
    this.shiftStyles(length, position, false)
  }

  shiftStyles(length, position, forward = true) {
    const multiplier = forward ? 1 : -1
    const pos = position ?? this.caretBefore ? this.caretPosition : this.caretPosition + 1
    this.rBold = this.rBold.map(el => el >= pos ? el + length * multiplier : el)
    this.rItalic = this.rItalic.map(el => el >= pos ? el + length * multiplier : el)
    this.rUnderline = this.rUnderline.map(el => el >= pos ? el + length * multiplier : el)
    this.rFontColor.forEach(el => el.range = el.range.map(val => val >= pos ? val + length * multiplier : val))
    this.rFontFamily.forEach(el => el.range = el.range.map(val => val >= pos ? val + length * multiplier : val))
    this.rFontSize.forEach(el => el.range = el.range.map(val => val >= pos ? val + length * multiplier : val))
    const fieldIndex = this.caretBefore ? pos + 1 : pos
    this.components.forEach(el => el.position = el.position >= (position ?? fieldIndex) ? el.position + length * multiplier : el.position)
  }

  getStyleChunk(type, index) {
    if (['rBold', 'rItalic', 'rUnderline'].includes(type)) {
      return this[type].filter(el => el >= index).map(el => el - index)
    }
    return this[type].map(el => {
      return { value: el.value, range: el.range.filter(val => val >= index).map(val => val - index) }
    }).filter(el => el.range.length)
  }

  printText(text) {
    this.shiftStyles(text.length)
    this.updateText(text.replace(/\s/g, ''))
    this.caretPosition += text.length
  }

  printKey(key) {
    this.shiftStyles(1)
    this.updateText(key)
    this.caretPosition++
  }

  updateText(value) {
    const { text, caretPosition } = this
    const pos = caretPosition + (this.caretBefore ? 0 : 1)
    this.caretBefore && this.caretPosition--
    this.caretBefore = false
    this.text = text.slice(0, pos) + value + text.slice(pos)
  }
}