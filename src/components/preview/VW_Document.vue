<template>
  <div class="document">
    <div class="ui secondary compact fitted borderless header menu">
      <div class="item">
        <div class="ui small header">
          <i class="teal file alternate icon"></i>
          <div class="content">{{document.title.trim() ? document.title : 'Новый документ'}}</div>
        </div>
      </div>
      <div class="right item">
      </div>
      <div class="item">
        <div class="ui tiny basic icon button" @click="$emit('close')">
          <i class="times icon"></i>
        </div>
      </div>
    </div>
    <div class="view">
      <div class="ui compact secondary menu">
        <div class="item">
          <Popup position="bottom left">
            <template v-slot:trigger>
              <span class="ui basic link text"><i class="file alternate outline icon"></i>Документ</span>
            </template>
            <template v-slot:content>
              <div class="insert-menu">
                <div class="ui left aligned tiny secondary vertical menu">
                  <a class="item" @click="$refs.imagePicker.click()">
                    <div class="relaxed flex">
                      <span class="ui fluid text">Сохранить</span>
                      <i class="save icon"></i>
                    </div>
                  </a>
                  <a class="item">
                    <div class="relaxed flex">
                      <span class="ui fluid text">Удалить</span>
                      <i class="trash alternate outline icon"></i>
                    </div>
                  </a>
                </div>
              </div>
            </template>
          </Popup>
        </div>
      </div>
      <div class="canvas" @mousedown.stop="handleMouseDown">
        <VwPage :data="document" @mousedown="handleMouseDown" @mouseup="handleMouseUp"/>
      </div>
    </div>
    <div class="settings" @keydown.stop="false">
      
    </div>
  </div>
</template>

<script>
import { fonts } from '@/common/defaults'

import CListItem from '@/common/classes/ListItem'

import VwPage from './VW_Page.vue'

import Dropdown from '@/components/misc/Dropdown.vue'
import Popup from '@/components/misc/Popup.vue'
import Slider from '@/components/misc/Slider.vue'

export default {
  name: 'CsDocument',
  components: {
    VwPage,
    Popup,
    Dropdown,
    Slider
  },
  props: {
    data: Object
  },
  data() {
    return {
      document: this.data,
      activeNode: null,
      activeField: null,
      selection: {
        isActive: false,
        isSelected: false,
        lines: '',
        start: {node: null, element: null, index: 0},
        end: {node: null, element: null, index: 0},
        components: []
      },
    }
  },
  watch: {
    'selection.end.index'() {
      this.selection.lines = ''
    }
  },
  mounted() {
    this.loadFonts()
    document.addEventListener('keydown', this.handleKeys, false)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeys, false)
  },
  computed: {
    isParagraphActive() {
      return ['paragraph', 'listItem'].includes(this?.activeNode?.type)
    },
    fontList() {
      return fonts.map(el => { return { name: el, value: `${el}` } })
    },
    activeType() {
      return this.activeNode?.type
    },
    isEditable() {
      return this.activeType === 'listItem' && this.activeNode.isEditable
    }
  },
  methods: {
    isNodeEditable(node) {
      return node?.type === 'listItem' && node?.isCustom
    },
    loadFonts() {
      this.fontList.forEach(el => {
        document.fonts.load(`14px ${el.value}`)
      })
    },
    addComponent(data) {
      const node = this.activeNode
      if (!node) return
      const parent = node.parent
      if (!parent) {
        data.parent = node
        node.components.push(data)
        return
      }
      data.parent = parent
      parent.components.splice(node.index + 1, 0, data)
      this.activeNode = data
    },
    handleMouseUp() {
      this.selection.isActive = false
    },
    handleMouseDown(e) {
      const { target } = e
      if (target.classList.contains('canvas')) {
        this.activeNode = this.document
        return
      }
      this.selection.lines = ''
      this.selection.components = []
      this.selection.start.node = null
      this.selection.isSelected = false
      this.selection.isActive = true
    },
    addParagraph() {
      if (this.activeType !== 'listItem' || !this.activeNode.parent.isEditable) return
      const { caretPosition, caretBefore, text, lineHeight, indent, fontColor, fontFamily, fontSize, align, parent, type, paddings } = this.activeNode
      const index = caretBefore ? caretPosition : caretPosition + 1
      const cAfter = text.slice(index)

      this.activeNode.caretPosition = 0

      this.activeNode.cutStyles(index)
      const options = {text: cAfter,
        lineHeight,
        indent,
        fontColor,
        fontFamily,
        fontSize,
        align,
        parent,
        paddings: [...paddings],
        isCustom: true
      }
      this.addComponent(new CListItem(options))
    },
    removeKey(forward = false) {
      if (!this.isEditable) return
      this.activeNode.removeKey(forward)
    },
    removeSelection() {
      const { components } = this.selection
      this.activeNode = null
      const editables = components.filter(el => el.target.isEditable)
      console.log(components);
      for (let component of editables) {
        const { target, range } = component
        const { text, parent } = target
        target.text = text.split('').filter((_el, idx) => !range.includes(idx)).join('')
        if (!target.text.length && target.isNotAlone && (parent.components.length > 1 || ['list', 'fragment'].includes(parent.type))) {
          target.remove()
        } else {
          const rangeSorted = range.sort((a, b) => a - b)
          target.removeShiftStyles(range.length, rangeSorted[0], false)
        }
      }
      this.selection.isSelected = false
    },
    typeText(key) {
      if (!this.isEditable) return
      this.activeNode.printKey(key)
    },
    async pasteText() {
      if (!this.isEditable) return
      const clipboard = await navigator.clipboard.readText()
      if (!clipboard) return
      this.activeNode.printText(clipboard)
    },
    handleKeys(e) {
      e.preventDefault()
      const { key, ctrlKey, keyCode } = e

      if (ctrlKey) {
        keyCode === 86 && this.pasteText()
        return
      }

      if (key.length === 1) {
        this.typeText(key)
        return
      }

      switch (key) {
        case 'Backspace':
          if (!this.selection.isSelected) {
            this.removeKey()
            return
          }
          this.removeSelection()
          break;
        case 'Delete':
          this.removeKey(true)
          break;
        case 'Enter':
          this.addParagraph()
          break;
        default:
          break;
      }
    }
  },
  provide() {
    return {
      getSelection: () => this.selection,
      setActiveNode: (node) => this.activeNode = node,
      getActiveNode: () => this.activeNode,
      setActiveField: (field) => this.activeField = field,
      getActiveField: () => this.activeField,
    }
  }
};
</script>

<style lang="scss" scoped>
  .document {
    height: 100%;
    padding: 0.5em;
    padding-top: 0;
    display: grid;
    grid-template: min-content 1fr / 1fr minmax(500px, 550px);
    .control {
      z-index: 30;
    }
    >.view {
      grid-area: 2 / 1 / span 1 / span 1;
      display: flex;
      flex-flow: column;
      min-height: 0;
      >div {
        border-bottom: 1px solid var(--border_color_1);
      }
      .canvas {
        background: var(--canvas-background);
        overflow: auto;
        >.page {
          margin: 0 auto;
          background: white;
        }
        padding-bottom: .5em;
      }
    }
    >.settings {
      grid-area: 2 / 2 / span 1 / span 1;
      border-left: 1px solid var(--border_color_1);
      padding: 0 .5em;
      margin-left: .5em;
      .scrolling {
        padding-top: 2px;
      }
    }
    >.header {
      grid-area: 1 / 1 / span 1 / span 2;
      border-bottom: 1px solid var(--border_color_1) !important;
    }
  }

  .palette {
    padding: 1em;
  }

  .insert-menu {
    padding: 0 0.5em;
    .item {
      i {
        font-size: 1.2em;
      }
    }
  }

  .font-size {
    width: 5.5em;
    min-width: auto !important;
  }

  .font-family {
    width: 12em;
    min-width: auto !important;
  }

  .font-lineheight {
    padding: 0;
  }
</style>
