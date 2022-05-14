<template v-cloak>
  <div class="paragraph" :style="paragraphStyles">
    <div class="content" @mousemove="handleMouseMove">
      <div class="cursor" :style="cursorStyles" v-if="isActive"></div>
      <canvas class="content" :width="canvasMeasures.width" :height="canvasMeasures.height" ref="canvas" :style="canvasStyles" @mousedown="handleMouseDown"></canvas>
      <canvas class="selection" :width="canvasMeasures.width" :height="canvasMeasures.height" ref="selection" :style="canvasStyles"></canvas>
    </div>
  </div>
</template>

<script>

import { fromPtToPx } from '@/common/utils'

export default {
  name: 'CsParagraph',
  props: {
    data: Object
  },
  inject: ['setActiveNode', 'getActiveNode', 'getSelection'],
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
    paragraphStyles() {
      const { paddingsPx } = this.data
      return {
        'padding-left': `${paddingsPx[3]}px`,
        'padding-right': `${paddingsPx[1]}px`
      }
    },
    listeningValues() {
      const { text, innerMeasures, indent } = this.data
      return `${innerMeasures.width}${indent}${text.length}`
    },
    cursorStyles() {
      const { x, y } = this.cursorPos
      const { caretBefore, caretPosition } = this.data
      const index = caretBefore ? caretPosition - 1 : caretPosition
      const letter = this.getLetterByIndex(index)
      return {
        left: `${Math.round(x / this.canvasDpi)}px`,
        top: `${Math.round(y / this.canvasDpi)}px`,
        height: `${Math.round((letter?.height ?? this.canvasLineHeight) / this.canvasDpi)}px`,
      }
    },
    cursorPos() {
      if (!this.linesToDraw.length) {
        return {
          x: 0,
          y: 0
        }
      }
      const letter = this.activeLetter
      const line = this.linesToDraw.find(el => el.letters.includes(letter))
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
      const { width, height } = this.data.innerMeasures
      return {
        width: `${width}px`,
        height: `${height}px`
      }
    },
    canvasMeasures() {
      const { width, height } = this.data.innerMeasures
      return {
        width: width * this.canvasDpi,
        height: height * this.canvasDpi
      }
    },
    canvasFont() {
      return this.data.fontSizePx * this.canvasDpi
    },
    appliedFont() {
      return `${this.canvasFont}px ${this.data.fontFamily}`
    },
    wordsArray() {
      let word = ''
      const result = []
      this.textValue.split('').forEach(el => {
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
      return this.wordsArray.map(word => {
        let wordWidth = 0
        const letters = word.split('').map((el, idx) => {
          const { font, fontSize } = this.getLetterStyles(start + idx)
          ctx.font = font
          const { width } = ctx.measureText(el)
          wordWidth += width
          return {
            letter: el,
            index: start + idx,
            width: Math.round(width),
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
    },
    linesToDraw() {
      let result = []
      let chunk = []
      let width = 0
      let index = 0
      const { align, indentPx } = this.data
      const { width:canvasWidth } = this.canvasMeasures
      for (const word of this.textMeasures) {
        const diff = index ? 0 : indentPx * this.canvasDpi
        const indent = this.data.indentPx * this.canvasDpi
        if (width + word.width <= canvasWidth - diff) {
          width += word.width
          chunk = chunk.concat(word.letters)
          continue
        }
        if (chunk.length) {
          result.push({letters: chunk})
          chunk = []
        }
        if (word.width > canvasWidth - (result.length ? 0 : indent)) {
          const chunks = this.splitToChunks(word, result.length)
          width = chunks[chunks.length - 1].letters.reduce((a, b) => a + b, 0)
          result = result.concat(chunks)
          continue
        }
        chunk = word.letters
        width = word.width
        index++
      }
      chunk.length && result.push({letters: chunk})
      let start = 0
      return result.map((el, idx) => {
        const { letters } = el
        const height = this.getMaxHeightLetter(letters)
        start += height
        width = 0
        const wLetters = letters.map(letter => {
          width += letter.width
          return {
            ...letter,
            posX: width - letter.width + (idx || align === 'right' ? 0 : indentPx * this.canvasDpi)
          }
        })

        if (align === 'right') {
          wLetters.forEach(val => val.posX += canvasWidth - width)
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
    }
  },
  methods: {
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
      if (!position) return
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
    getLetterStyles(index) {
      const { rFontSize, rFontColor, rFontFamily, fontColor, fontFamily, rBold, rItalic, rUnderline } = this.data
      const fSize = rFontSize.find(el => el.range.includes(index))?.value
      const fColor = rFontColor.find(el => el.range.includes(index))?.value
      const fFamily = rFontFamily.find(el => el.range.includes(index))?.value
      const fBold = rBold.indexOf(index) > -1 ? 'bold' : ''
      const fItalic = rItalic.indexOf(index) > -1 ? 'italic' : ''
      const fUnderline = rUnderline.indexOf(index) > -1 ? 'underline' : ''

      const fontSize = (fSize ? fromPtToPx(fSize) : this.data.fontSizePx) * this.canvasDpi
      return {
        font: `${fBold} ${fItalic} ${fUnderline} ${fontSize}px ${fFamily ?? fontFamily}`,
        color: fColor ?? fontColor,
        fontSize
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
        const percentage = ( posX - letter.posX ) / letter.width
        return { before: percentage <= 0.5, position: letter.index }
      }
      return { before: false, position: line.letters[line.letters.length - 1].index }
    },
    setCursor(e) {
      const { before, position } = this.getCursorPos(e)
      this.data.caretPosition = position
      this.data.caretBefore = before
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
      const indent = startPos ? 0 : this.data.indentPx * this.canvasDpi
      for (const letter of word.letters) {
        if (width + letter.width <= canvasWidth - (result.length ? 0 : indent)) {
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
    drawLetter(posY, letterObj) {
      const canvas = this.canvas
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      const { posX, letter, index } = letterObj
      const { font, color } = this.getLetterStyles(index)
      ctx.font = font
      ctx.fillStyle = color
      ctx.textBaseline = 'alphabetic'
      ctx.fillText(letter, posX, posY)
    },
    drawLine(line) {
      const { height, posY } = line
      line.letters.forEach(el => this.drawLetter(posY + height - height / 4, el))
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
      this.data.setInnerHeight(Math.max(this.linesToDraw.reduce((a, b) => a + b.height, 0) / this.canvasDpi), this.canvasLineHeight)
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
      if (selStart === 0 && selEnd === 0) {
        const pos = [ start.index, end.index ].sort((a, b) => a - b)
        this.linesToDraw.forEach(y => {
          y.letters.forEach(x => {
            const isWithin = x.index >= pos[0] && x.index <= pos[1]
            if (isWithin) {
              ctx.fillRect(x.posX, y.posY, x.width, y.height)
              res += x.letter
            }
          })
        })
      } else if (selStart === 0 && selEnd === 2) {
        this.linesToDraw.forEach(y => {
          y.letters.forEach(x => {
            if (x.index >= start.index) {
              ctx.fillRect(x.posX, y.posY, x.width, y.height)
              res += x.letter
            }
          })
        }) 
      } else if (selStart === 4 && selEnd === 0) {
        this.linesToDraw.forEach(y => {
          y.letters.forEach(x => {
            if (x.index <= end.index) {
              ctx.fillRect(x.posX, y.posY, x.width, y.height)
              res += x.letter
            }
          })
        }) 
      } else if (selStart === 4 && selEnd === 2 || selStart === 2 && selEnd === 4) {
        this.linesToDraw.forEach(y => {
          y.letters.forEach(x => {
            ctx.fillRect(x.posX, y.posY, x.width, y.height)
            res += x.letter
          })
        }) 
      } else if (selStart === 2 && selEnd === 0) {
        this.linesToDraw.forEach(y => {
          y.letters.forEach(x => {
            if (x.index >= end.index) {
              ctx.fillRect(x.posX, y.posY, x.width, y.height)
              res += x.letter
            }
          })
        })
      } else if (selStart === 0 && selEnd === 4) {
        this.linesToDraw.forEach(y => {
          y.letters.forEach(x => {
            if (x.index <= start.index) {
              ctx.fillRect(x.posX, y.posY, x.width, y.height)
              res += x.letter
            }
          })
        }) 
      }
      this.selection.lines += res
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
  }
</style>
