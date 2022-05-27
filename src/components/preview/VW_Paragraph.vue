<template v-cloak>
  <div class="paragraph" :style="paragraphStyles">
    <div class="content" @mousemove="handleMouseMove">
      <div class="cursor" :style="cursorStyles" :class="{blank: !data.text.length}" v-if="isActive && isListItem && data.parent.isEditable"></div>
      <canvas class="content" :width="canvasMeasures.width" :height="canvasMeasures.height" ref="canvas" :style="canvasStyles" @mousedown="handleMouseDown"></canvas>
      <canvas class="selection" :width="canvasMeasures.width" :height="canvasMeasures.height" ref="selection" :style="canvasStyles"></canvas>
    </div>
  </div>
</template>

<script>

import { fromPtToPx } from '@/common/utils'

import Popup from '@/components/misc/Popup.vue'

export default {
  name: 'VwParagraph',
  components: {
    Popup
  },
  props: {
    data: Object
  },
  inject: ['setActiveNode', 'getActiveNode', 'getSelection', 'setActiveField', 'getActiveField'],
  data() {
    return {
      canvasDpi: 2,
      canvas: null
    }
  },
  watch: {
    listeningValues() {
      this.renderCanvas()
    },
    'selection.isSelected'(newVal) {
      !newVal && this.clearSelection()
    },
    'selection.end.index'() {
      this.renderSelection()
    }
  },
  mounted() {
    this.canvas = this.$refs.canvas
    this.renderCanvas()
  },
  computed: {
    cursorStyles() {
      const { x, y } = this.cursorPos
      const { caretBefore, caretPosition, indentPx, text } = this.data
      const index = caretBefore ? caretPosition - 1 : caretPosition
      const letter = this.getLetterByIndex(index)
      let left = !this.isListItem && this.isPositiveIndent ? this.data.indentPx : 0
      if (text.length) {
        left = Math.round(x / this.canvasDpi)
      }
      if (this.isListItem && !text.length) {
        left += (this.linesToDraw[0]?.letters[0]?.width ?? 0) / this.canvasDpi
      }
      return {
        left: `${this.isPositiveIndent ? left : left + indentPx}px`,
        top: `${Math.round(y / this.canvasDpi)}px`,
        height: `${Math.round((letter?.height ?? this.canvasLineHeight) / this.canvasDpi)}px`,
      }
    },
    isPositiveIndent() {
      return this.data.indent >= 0
    },
    firstLineIndent() {
      const { indentPx:indent } = this.data
      return this.isPositiveIndent ? indent * this.canvasDpi : 0
    },
    lastLineIndent() {
      const { indentPx:indent } = this.data
      return this.isPositiveIndent ? 0 : indent * this.canvasDpi * -1
    },
    inputFields() {
      let result = []
      for (const line of this.linesToDraw) {
        const inputs = line.letters.filter(el => el.input).map(el => {
          const { fontColor, fontSize, fontFamily } = el.input
          const { fontColor:pFontColor, fontSize:pFontSize, fontFamily:pFontFamily } = this.data
          const { posX, width, height } = el
          const left = posX / this.canvasDpi
          return {
            style: {
              'font-family': fontFamily ?? pFontFamily,
              'font-size': fontSize ?? pFontSize,
              'color': fontColor ?? pFontColor,
              left: `${this.isPositiveIndent ? left : left + this.data.indentPx }px`,
              top: `${line.posY / this.canvasDpi}px`,
              width: `${width / this.canvasDpi}px`,
              height: `${height / this.canvasDpi}px`,
            },
            data: el.input,
            isActive: this.activeNode === el.input
          }
        })
        result = result.concat(inputs)
      }
      return result
    },
    paragraphStyles() {
      const { paddingsPx } = this.data
      return {
        'padding-left': `${paddingsPx[3]}px`,
        'padding-right': `${paddingsPx[1]}px`,
        'padding-top': `${paddingsPx[0]}px`,
        'padding-bottom': `${paddingsPx[2]}px`
      }
    },
    listeningValues() {
      const { components, order, text } = this.data
      const inputs = components.reduce((a, b) => a + b.value.length, 0)
      return `${inputs}${this.activeField?.id}${order}${text.length}`
    },
    cursorPos() {
      const letter = this.activeLetter
      const line = this.linesToDraw.find(el => el.letters.includes(letter))
      if (!this.data.text.length || !line) {
        return {
          x: 0,
          y: 0
        }
      }
      const { posY, height:lineHeight } = line
      const { posX, width } = letter
      return {
        x: this.data.caretBefore ? posX : posX + width,
        y: posY + lineHeight - lineHeight / 4
      }
    },
    activeLetter() {
      for (const line of this.linesToDraw) {
        const letter = line.letters.find(el => el.index === this.data.caretPosition)
        if (letter) return letter
      }
    },
    activeNode() {
      return this.getActiveNode()
    },
    isActive() {
      return this.data === this.getActiveNode()
    },
    lineHeight() {
      const { fontSizePx, lineHeight } = this.data
      return fontSizePx * lineHeight
    },
    canvasLineHeight() {
      return this.lineHeight * this.canvasDpi
    },
    textValue() {
      return this.data.text
    },
    canvasStyles() {
      const { width, height } = this.canvasMeasures
      return {
        width: `${width / this.canvasDpi}px`,
        height: `${height / this.canvasDpi}px`,
        'margin-left': `${this.data.indentPx > 0 ? 0 : this.data.indentPx}px`
      }
    },
    canvasMeasures() {
      const { width, height } = this.data.innerMeasures
      return {
        width: width * this.canvasDpi + this.lastLineIndent,
        height: height * this.canvasDpi
      }
    },
    canvasFont() {
      return this.data.fontSizePx * this.canvasDpi
    },
    appliedFont() {
      return `${this.canvasFont}px ${this.data.fontFamily}`
    },
    inputIndexes() {
      return this.data.components.map(el => {
        return {
          input: el,
          start: el.position,
          end: el.position + el.displayValue.length
        }
      })
    },
    wordsArray() {
      let word = ''
      const result = []
      let text = this.textValue
      for (const field of this.data.components) {
        const { displayValue, position } = field
        const tBefore = text.slice(0, position)
        const tAfter = text.slice(position)
        text = `${tBefore}${displayValue}${tAfter}`
      }
      text.split('').forEach(el => {
        if (el.trim()) {
          word += el
        } else {
          if (word.length) {
            result.push(word)
            word = ''
          }
          result.push(el)
        }
      })
      word.length && result.push(word)
      return result
    },
    textMeasures() {
      const canvas = this.canvas
      if (!canvas) return []
      const ctx = canvas.getContext('2d')
      let start = 0
      let result = []
      if (this.isListItem) {
        ctx.font = this.appliedFont
        const { indentPx, order } = this.data 
        const letter = `${order} `
        const numWidth = Math.round(ctx.measureText(letter).width)
        const diff = indentPx < 0 ? Math.max(indentPx * -1 * this.canvasDpi - numWidth, 0) : 0
        const letterObj = {
          letter,
          isIndex: true,
          width: numWidth + diff,
          height: this.canvasFont
        }
        result.push({
          start: 0,
          letters: [letterObj],
          width: numWidth + diff
        })
      }
      const words = this.wordsArray.map(word => {
        let wordWidth = 0
        const letters = word.split('').map((el, idx) => {
          const index = start + idx
          const { font, fontSize } = this.getLetterStyles(index)
          ctx.font = font
          const width = Math.round(ctx.measureText(el).width)
          const input = this.inputIndexes.find(val => index >= val.start && index < val.end)?.input
          wordWidth += width
          return {
            letter: el,
            index,
            width,
            input,
            height: Math.round(fontSize * this.data.lineHeight)
          }
        })
        const res = {
          start,
          letters,
          width: wordWidth
        }
        start += word.length
        return res
      })
      return result.concat(words)
    },
    linesToDraw() {
      const result = this.getLineChunks()
      const { align } = this.data
      const { width:canvasWidth } = this.canvasMeasures
      let start = 0
      let width = 0
      return result.map((el, index) => {
        const { letters } = el
        const height = this.getMaxHeightLetter(letters)
        start += height
        width = 0
        let wLetters = letters.map(letter => {
          width += letter.width
          return {
            ...letter,
            posX: width - letter.width + (index || align === 'right' ? this.lastLineIndent : this.firstLineIndent)
          }
        })
        const freeSpace = canvasWidth - width - (index ? this.lastLineIndent : this.firstLineIndent)
        if (align === 'right') {
          wLetters.forEach(val => val.posX += canvasWidth - width)
        } else if (align === 'center') {
          wLetters.forEach(val => val.posX += Math.floor(freeSpace / 2))
        } else if (align === 'justify' && index !== result.length - 1) {
          const emptyLetters = wLetters.filter((val, idx) => !val.input && !val.letter.trim() && idx !== wLetters.length - 1).length
          const append = Math.floor(freeSpace / emptyLetters)
          if (emptyLetters) {
            let shift = 0
            for (let i = 0; i < wLetters.length; i++) {
              const value = wLetters[i]
              if (!value.input && !value.letter.trim() && i !== wLetters.length - 1) {
                const cellAppend = Math.max(value.width + append, value.width)
                const cellDiff = cellAppend - value.width
                shift += cellDiff
                value.width = cellAppend
                value.posX += shift - cellDiff
                continue
              }
              value.posX += shift
            }
          }
        }

        return {
          posY: start - height,
          height: height,
          letters: wLetters
        }
      })
    },
    selection() {
      return this.getSelection()
    },
    isListItem() {
      return this.data.type === 'listItem'
    },
    activeField() {
      return this.getActiveField()
    }
  },
  methods: {
    appendChunks(result, chunks, index) {
      return [
        index + chunks.length - 1, //index
        chunks[chunks.length - 1].letters.reduce((a, b) => a + b.width, 0), //width
        result.concat(chunks.slice(0, -1)), //result
        [...chunks[chunks.length - 1].letters] //chunk
      ]
    },
    getLineChunks() {
      let result = []
      let chunk = []
      let width = 0
      let index = 0
      const { width:canvasWidth } = this.canvasMeasures
      
      for (const word of this.textMeasures) {
        const diff = index ? this.lastLineIndent : this.firstLineIndent
        
        if (width + word.width <= canvasWidth - diff) {
          width += word.width
          chunk = chunk.concat(word.letters)
          continue
        }
        if (chunk.length) {
          result.push({letters: chunk})
        }
        if (word.width > canvasWidth - (result.length ? this.lastLineIndent : this.firstLineIndent)) {
          const chunks = this.splitToChunks(word, result.length);
          [ index, width, result, chunk ] = this.appendChunks(result, chunks, index)
          continue
        }
        chunk = word.letters
        width = word.width
        index++
      }
      chunk.length && result.push({letters: chunk})
      return result
    },
    handleMouseMove(e) {
      const { start, end, isActive } = this.selection
      if (!isActive) return
      if (start.node === null) {
        start.node = this.data
        start.element = this.$el
        const index = !this.data.caretBefore ? this.data.caretPosition + 1 : this.data.caretPosition 
        start.index = index
        return
      }
      this.selection.isSelected = true
      end.node = this.data
      end.element = this.$el
      const position = this.getCursorPos(e)?.position
      if (typeof position !== 'number') return
      end.index = position
    },
    getLetterByIndex(index) {
      for (const line of this.linesToDraw) {
        const letter = line.letters.find(el => el.index === index)
        if (letter) return letter
      }
    },
    getMaxHeightLetter(letters) {
      return letters.reduce((a, b) => Math.max(a, b.height), 0)
    },
    getInputStyles(input) {
      const { fontSize, fontColor, fontFamily } = this.data
      const { iFontSize, iFontColor, iFontFamily, bold, italic, underline } = input
      const fSize = iFontSize ?? fontSize
      const fColor = iFontColor ?? fontColor
      const fFamily = iFontFamily ?? fontFamily
      const fBold = bold ? 'bold' : ''
      const fItalic = italic ? 'italic' : ''
      return {
        font: `${fBold} ${fItalic} ${fromPtToPx(fSize) * this.canvasDpi}px ${fFamily}`,
        color: fColor,
        underline
      }
    },
    getLetterStyles(index) {
      const { rFontSize, rFontColor, rFontFamily, fontColor, fontFamily, rBold, rItalic, rUnderline } = this.data
      const fSize = rFontSize.find(el => el.range.includes(index))?.value
      const fColor = rFontColor.find(el => el.range.includes(index))?.value
      const fFamily = rFontFamily.find(el => el.range.includes(index))?.value ?? fontFamily
      const fBold = rBold.indexOf(index) > -1 ? 'bold' : ''
      const fItalic = rItalic.indexOf(index) > -1 ? 'italic' : ''
      const underline = rUnderline.indexOf(index) > -1

      const fontSize = (fSize ? fromPtToPx(fSize) : this.data.fontSizePx) * this.canvasDpi
      return {
        font: `${fBold} ${fItalic} ${fontSize}px ${fFamily}`,
        color: fColor ?? fontColor,
        fontSize,
        underline,
        fFamily
      }
    },
    getCursorPos(e) {
      const { offsetX, offsetY } = e
      const posY = offsetY * this.canvasDpi
      const posX = offsetX * this.canvasDpi
      const line = this.linesToDraw.find(el => el.posY + el.height >= posY)
      if (!line) return
      const letter = line.letters.find(el => el.posX + el.width >= posX)
      if (letter) {
        if (typeof letter.index === 'undefined') return { before: true, position: 0 }
        const percentage = ( posX - letter.posX ) / letter.width
        return { before: percentage <= 0.5, position: letter.index }
      }
      return { before: false, position: line.letters[line.letters.length - 1].index }
    },
    setCursor(e) {
      if (!this.data.text.length) return
      const { before, position } = this.getCursorPos(e)
      this.data.caretPosition = position
      this.data.caretBefore = before
      const input = this.activeLetter?.input ?? null
      this.setActiveField(input)
    },
    handleMouseDown(e) {
      this.setActiveNode(this.data)
      this.setCursor(e)
    },
    splitToChunks(word, startPos) {
      const result = []
      let width = 0
      let chunk = []
      const { width:canvasWidth } = this.canvasMeasures
      for (const letter of word.letters) {
        if (width + letter.width <= canvasWidth - (result.length || startPos ? this.lastLineIndent : this.firstLineIndent)) {
          width += letter.width
        } else {
          chunk.length && result.push({letters: [...chunk]})
          width = letter.width
          chunk = []
        }
        chunk.push(letter)
      }
      chunk.length && result.push({letters: [...chunk]})
      return result
    },
    drawLetter(posY, letterObj, line) {
      const canvas = this.canvas
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      const { posX, letter, index, width, input, isIndex } = letterObj
      if (this.data.isCustom && !isIndex) {
        ctx.fillStyle = 'rgba(220, 200, 25, .3)'
        ctx.fillRect(posX, line.posY, width, line.height)
      }
      if (input) {
        if (this.activeField === input) {
          ctx.fillStyle = 'rgba(100, 250, 30, .2)'
        } else {
          ctx.fillStyle = 'rgba(120, 90, 250, .2)'
        }
        ctx.fillRect(posX, line.posY, width, line.height)
      }
      let settings = this.getLetterStyles(index)
      if (input) {
        settings = this.getInputStyles(input)
      }
      const { font, color, underline } = settings
      ctx.textBaseline = 'alphabetic'
      ctx.font = font
      ctx.fillStyle = color
      ctx.fillText(letter, posX, posY)
      if (underline) {
        ctx.fillRect(posX, posY + this.canvasDpi * 2, width, 2)
      }
    },
    drawLine(line) {
      const { height, posY } = line
      line.letters.forEach(el => this.drawLetter(posY + height - height / 4, el, line))
    },
    clearCanvas() {
      const canvas = this.canvas
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      const { width, height } = this.canvasMeasures
      ctx.clearRect(0, 0, width, height)
    },
    drawText() {
      this.clearCanvas()
      this.linesToDraw.forEach(el => this.drawLine(el))
    },
    renderCanvas() {
      this.data.setInnerHeight(Math.max(this.linesToDraw.reduce((a, b) => a + b.height, 0) / this.canvasDpi, this.canvasLineHeight / this.canvasDpi))
      this.$nextTick(() => this.drawText())
    },
    clearSelection() {
      const canvas = this.$refs.selection
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      const { width, height } = this.canvasMeasures
      ctx.clearRect(0, 0, width, height)
    },
    renderSelection() {
      const canvas = this.$refs.selection
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      this.clearSelection()
      ctx.fillStyle = 'rgba(0, 0, 0, .2)'
      const { start, end, isSelected } = this.selection
      if (!isSelected) return
      
      const { start:selStart, end:selEnd } = this.compareSelectionPosition()
      let res = ''
      const range = []
      if (selStart === 0 && selEnd === 0) {
        const pos = [ start.index, end.index ].sort((a, b) => a - b)
        this.linesToDraw.forEach(y => {
          y.letters.forEach(x => {
            const isWithin = x.index >= pos[0] && x.index <= pos[1]
            if (isWithin) {
              range.push(x.index)
              ctx.fillRect(x.posX, y.posY, x.width, y.height)
              res += x.letter
            }
          })
        })
      } else if (selStart === 0 && selEnd === 2) {
        this.linesToDraw.forEach(y => {
          y.letters.forEach(x => {
            if (x.index >= start.index) {
              range.push(x.index)
              ctx.fillRect(x.posX, y.posY, x.width, y.height)
              res += x.letter
            }
          })
        }) 
      } else if (selStart === 4 && selEnd === 0) {
        this.linesToDraw.forEach(y => {
          y.letters.forEach(x => {
            if (x.index <= end.index) {
              range.push(x.index)
              ctx.fillRect(x.posX, y.posY, x.width, y.height)
              res += x.letter
            }
          })
        }) 
      } else if (selStart === 4 && selEnd === 2 || selStart === 2 && selEnd === 4) {
        this.linesToDraw.forEach(y => {
          y.letters.forEach(x => {
            range.push(x.index)
            ctx.fillRect(x.posX, y.posY, x.width, y.height)
            res += x.letter
          })
        }) 
      } else if (selStart === 2 && selEnd === 0) {
        this.linesToDraw.forEach(y => {
          y.letters.forEach(x => {
            if (x.index >= end.index) {
              range.push(x.index)
              ctx.fillRect(x.posX, y.posY, x.width, y.height)
              res += x.letter
            }
          })
        })
      } else if (selStart === 0 && selEnd === 4) {
        this.linesToDraw.forEach(y => {
          y.letters.forEach(x => {
            if (x.index <= start.index) {
              range.push(x.index)
              ctx.fillRect(x.posX, y.posY, x.width, y.height)
              res += x.letter
            }
          })
        }) 
      }
      this.selection.lines += res
      if (range.length) {
        const { components } = this.selection
        const target = components.find(el => el.target === this.data)
        if (target) {
          target.range = range
          return
        }
        components.push({target: this.data, range})
      }
    },
    compareSelectionPosition() {
      const { start, end } = this.selection
      return {
        start: start.element.compareDocumentPosition(this.$el),
        end: end.element.compareDocumentPosition(this.$el)
      }
    }
  }
};

</script>

<style lang="scss" scoped>
  .paragraph {
    .cursor {
      user-select: none;
      pointer-events: none;
      position: absolute;
      width: 1px;
      background: red;
      opacity: .7;
      transform: translate(-1px, -75%);
      animation: cursor-blink 1.2s steps(1) infinite;
      z-index: 10;
      &.blank {
        transform: translate(0, 0);
      }
    }
    .content {
      cursor: text;
      display: flex;
      //box-shadow: 0 0 0 1px #aaaaaa;
      canvas {
        &.selection {
          position: absolute;
          top: 0;
          left: 0;
        }
        &.content {
          z-index: 5;
        }
      }
    }
    .pilcrow {
      position: absolute;
      transform: scaleX(-1);
      user-select: none;
      pointer-events: none;
      margin-top: -2px;
    }
    .input-field {
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .4);
      user-select: none;
      position: absolute;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: .3em;
      cursor: pointer;
      z-index: 5;
      &.active {
        box-shadow: inset 0 0 0 1px #2185d0;
      }
    }
  }
</style>
