<template>
  <div class="line-wrap">
    <div class="line-bar" :style="barStyles">
      <div class="pad left" :style="padStyles.left">
        <div class="marker indent" :style="indentStyles" @mousedown.stop="onMouseDown($event, 'indent')">
          <img src="@/assets/img/i_indent.svg" alt="" />
        </div>
        <div class="marker left" @mousedown.stop="onMouseDown($event, 'left')">
          <div class="separator" v-if="resize.isActive && resize.type === 'left'"></div>
          <img src="@/assets/img/i_mark_left.svg" alt="" />
        </div>
      </div>
      <div class="pad right" :style="padStyles.right">
        <div class="marker right" @mousedown.stop="onMouseDown($event, 'right')">
          <div class="separator" v-if="resize.isActive && resize.type === 'right'"></div>
          <img src="@/assets/img/i_mark_right.svg" alt="" />
        </div>
      </div>
      <div class="cm" v-for="(cm, key) in cmS">
        <span class="half"></span>
        <span class="half"></span>
        <span class="index">{{key + 1}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { fromCmToPx, fromPxToCm } from '@/common/utils'

export default {
  name: 'DGCN_Line',
  props: {
    data: Object
  },
  inject: ['getActiveNode'],
  data() {
    return {
      document: this.data,
      format: this.data.format,
      pagePaddings: this.data.paddings,
      resize: {
        isActive: false,
        type: 'left',
        startPos: 0
      }
    }
  },
  mounted() {
    document.addEventListener('mouseup', this.onMouseUp, false)
    document.addEventListener('mousemove', this.onMouseMove, false)
  },
  beforeUnmount() {
    document.removeEventListener('mouseup', this.onMouseUp, false)
    document.removeEventListener('mousemove', this.onMouseMove, false)
  },
  methods: {
    onMouseUp() {
      this.resize.isActive = false
    },
    onMouseDown(e, type) {
      this.resize.isActive = true
      this.resize.type = type
      this.resize.startPos = e.pageX
    },
    onMouseMove(e) {
      const { isActive, startPos, type } = this.resize
      if (!isActive) return
      if (type === 'indent' && !this.isIndentable) return
      const { pageX } = e
      const diff = fromPxToCm(pageX - startPos)
      const innerCm = fromPxToCm(this.innerWidth)
      if (innerCm <= 2 && ( type === 'left' && diff > 0 || type === 'right' && diff < 0 )) return
      if (Math.abs(diff) >= 0.25) {
        this.resize.startPos = pageX
        const { paddings, indent, relativePos } = this.activeNode
        const relativeLeft = fromPxToCm(relativePos.left) + paddings[3]
        switch (type) {
          case 'left':
            this.activeNode.paddings[3] = Math.max(paddings[3] + 0.25 * Math.sign(diff), 0)
            break;
          case 'right':
            if (this.activeNode.type === 'image') return
            this.activeNode.paddings[1] = Math.max(paddings[1] + 0.25 * Math.sign(diff) * -1, 0)
            break;
          case 'indent':
            if (innerCm <= 1.5 && Math.sign(diff) > 0) return
            this.activeNode.indent = Math.max(indent + 0.25 * Math.sign(diff), -relativeLeft)
            break;
        }
      }
    }
  },
  computed: {
    isIndentable() {
      return ['paragraph', 'listItem'].includes(this.activeNode.type)
    },
    activeNode() {
      const node = this.getActiveNode() ?? this.document
      return node.type !== 'field' ? node : node.parent
    },
    cmS() {
      return Math.ceil(this.format.width)
    },
    barStyles() {
      const { width } = this.format
      return {
        width: `${fromCmToPx(width)}px`
      }
    },
    innerWidth() {
      const { innerMeasures, indentPx } = this.activeNode
      return innerMeasures.width - ( indentPx ?? 0 )
    },
    padStyles() {
      const { paddingsPx:paddings, relativePos } = this.activeNode
      
      return {
        left: {
          width: `${relativePos.left + paddings[3]}px`
        },
        right: {
          width: `${relativePos.right + paddings[1]}px`
        }
      }
    },
    indentStyles() {
      const { indentPx } = this.activeNode
      const indent = (indentPx ?? 0) * -1
      return {
        right: `${indent}px`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .line-wrap {
    background: var(--canvas-background);
    padding: .5em 0;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .line-bar {
    font-family: monospace, sans-serif;
    display: flex;
    align-items: center;
    background: white;
    height: 1.2em;
    overflow: visible;
    margin: 0 auto;
    .cm {
      display: grid;
      grid-template: 1fr / 50% 50% auto;
      align-items: center;
      width: 1cm;
      >.half {
        position: relative;
        height: 65%;
        &::before {
          content: '';
          position: absolute;
          height: 3px;
          width: .5px;
          background: rgba(0, 0, 0, .57);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        &:first-child {
          border-right: 1px solid rgba(0, 0, 0, .57);
        }
      }
      >.index {
        font-size: 10px;
        transform: translateX(-50%);
      }
    }
  }

  .line-bar {
    .pad {
      position: absolute;
      height: 100%;
      background: rgba(0, 0, 0, .2);
      z-index: 5;
      .marker {
        position: absolute;
        display: flex;
        user-select: none;
        cursor: pointer;
        >img {
          width: 12px;
          user-select: none;
          pointer-events: none;
        }
      }
      &.left {
        left: 0;
        .marker {
          right: 0;
          top: 9px;
          transform: translateX(50%);
        }
        .indent {
          right: 0;
          top: -1px;
          transform: translateX(50%);
        }
      }
      &.right {
        right: 0;
        .marker {
          left: 0;
          transform: translateX(-50%);
          bottom: 0;
        }
      }
    }
  }

  .separator {
    height: 100vh;
    position: absolute;
    border-left: 1px dashed black;
    left: 50%;
  }

</style>
