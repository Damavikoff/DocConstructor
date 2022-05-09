<template>
  <div class="paragraph">
    <canvas :width="canvasMeasures.width" :height="canvasMeasures.height" ref="canvas" :style="canvasStyles"></canvas>
  </div>
</template>

<script>

export default {
  name: 'CsParagraph',
  props: {
    data: Object
  },
  data() {
    return {
      canvasDpi: 2
    }
  },
  mounted() {
    this.data.setInnerHeight(this.linesToDraw.length * this.lineHeight)
    this.$nextTick(() => this.drawText())
  },
  computed: {
    lineHeight() {
      return this.data.fontSizePx * this.settings.lineHeight
    },
    canvasLineHeight() {
      return this.lineHeight * this.canvasDpi
    },
    textValue() {
      return this.data.text
    },
    settings() {
      return this.data.settings
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
      return `${this.canvasFont}px ${this.settings.fontFamily}`
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
      const canvas = this.$refs.canvas
      if (!canvas) return []
      const ctx = this.$refs.canvas.getContext('2d')
      ctx.font = this.appliedFont
      let start = 0
      return this.wordsArray.map(word => {
        const measures = ctx.measureText(word)
        const letters = word.split('').map((el, idx) => {
          const { width } = ctx.measureText(el)
          return {
            letter: el,
            index: start + idx,
            width: Math.round(width)
          }
        })
        const res = {
          start,
          letters,
          width: measures.width
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
      const { width:canvasWidth } = this.canvasMeasures
      for (const word of this.textMeasures) {
        if (width + word.width <= canvasWidth) {
          width += word.width
          chunk = chunk.concat(word.letters)
          continue
        }
        if (chunk.length) {
          result.push({posY: index * this.canvasLineHeight, letters: chunk})
          chunk = []
        }
        if (word.width > canvasWidth) {
          const chunks = this.splitToChunks(word).map(el => {
            return {
              posY: this.canvasLineHeight * index++,
              letters: el
            }
          })
          width = chunks[chunks.length - 1].letters.reduce((a, b) => a + b, 0)
          result = result.concat(chunks)
          continue
        }
        chunk = word.letters
        width = word.width
        index++
      }
      chunk.length && result.push({posY: index * this.canvasLineHeight, letters: chunk})
      return result.map(el => {
        const { posY, letters } = el
        width = 0
        return {
          posY,
          letters: letters.map(letter => {
            width += letter.width
            return {
              ...letter,
              posX: width - letter.width
            }
          })
        }
      })
    }
  },
  methods: {
    splitToChunks(word) {
      const result = []
      let width = 0
      let chunk = []
      for (const letter of word.letters) {
        if (width + letter.width <= this.canvasWidth) {
          chunk.push(letter)
          width += letter.width
        } else {
          chunk.length && result.push(chunk)
          width = 0
          chunk = []
        }
      }
      chunk.length && result.push(chunk)
      return result
    },
    drawLetter(posY, letterObj) {
      const canvas = this.$refs.canvas
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      const { posX, letter } = letterObj
      ctx.font = this.appliedFont;
      ctx.textBaseline = 'top'
      ctx.fillText(letter, posX, posY)
    },
    drawLine(line) {
      line.letters.forEach(el => this.drawLetter(line.posY, el))
    },
    drawText() {
      this.linesToDraw.forEach(el => this.drawLine(el))
    }
  }
};

</script>

<style lang="scss" scoped>
  .paragraph {
    display: flex;
    border: 1px solid black;
  }
</style>
