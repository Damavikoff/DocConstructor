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
    this.fontFamily = 'Monospace'
    this.fontSize = 14
    this.text = ''
    this.caretPosition = 0
    this.caretBefore = true
    this.type = 'paragraph'
    Object.assign(this, data)
  }

  get indentPx() {
    return fromCmToPx(this.indent)
  }

  get fontSizePx() {
    return fromPtToPx(this.fontSize)
  }

  removeKey(forward = false) {
    let index = this.caretPosition
    if (forward && !this.caretBefore) index++
    if (!forward && this.caretBefore) index--
    if (!forward && index < 0) return
    if (forward && index === this.text.length) return
    if (!forward) {
      this.caretPosition = Math.max(this.caretPosition - 1, 0)
      if (!index && !this.caretBefore) this.caretBefore = true
    } else {
      if (this.caretBefore) {
        this.caretPosition--
        this.caretBefore = false
      }
    }
    this.text = this.text.slice(0, index) + this.text.slice(index + 1)
  }

  shiftStyles(length) {
    const pos = this.caretBefore ? this.caretPosition : this.caretPosition + 1
    this.rBold = this.rBold.map(el => el >= pos ? el + length : el)
    this.rItalic = this.rItalic.map(el => el >= pos ? el + length : el)
    this.rUnderline = this.rUnderline.map(el => el >= pos ? el + length : el)
    this.rFontColor.forEach(el => el.range = el.range.map(val => val >= pos ? val + length : val))
    this.rFontFamily.forEach(el => el.range = el.range.map(val => val >= pos ? val + length : val))
    this.rFontSize.forEach(el => el.range = el.range.map(val => val >= pos ? val + length : val))
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