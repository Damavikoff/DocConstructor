<template>
  <div class="document">
    <div class="view">
      <div class="control menu">
        <div class="item">
          <input type="file" accept="image/*" ref="imagePicker" hidden @change="setImageData"/>
          <i class="large align left link icon grey"></i>
          <i class="large align center link icon grey"></i>
          <i class="large align right link icon grey"></i>
          <i class="large align justify link icon grey"></i>
        </div>
        <div class="item">
          <i class="bordered bold link icon"></i>
          <i class="bordered underline link icon"></i>
          <i class="bordered italic link icon"></i>
          <i class="bordered paragraph link icon"></i>
        </div>
        <div class="item">
          <Popup position="bottom left">
            <template v-slot:trigger>
              <i class="fitted bordered font link icon">
                <span class="underline"></span>
              </i>
            </template>
            <template v-slot:content>
              <ColorPalette :value="null" @update="" />
            </template>
          </Popup>
        </div>
        <div class="fluid right aligned item">
          <Popup position="bottom right">
            <template v-slot:trigger>
              <span class="ui link text">Вставка</span>
            </template>
            <template v-slot:content>
              <div class="insert-menu">
                <div class="ui left aligned tiny secondary vertical menu">
                  <a class="item" @click="$refs.imagePicker.click()">
                    <div class="relaxed flex">
                      <span class="ui fluid text">Изображение</span>
                      <i class="image outline icon"></i>
                    </div>
                  </a>
                  <a class="item">
                    <div class="relaxed flex">
                      <span class="ui fluid text">Параграф</span>
                      <i class="paragraph icon"></i>
                    </div>
                  </a>
                </div>
              </div>
            </template>
          </Popup>
        </div>
      </div>
      <div class="canvas" @mousedown.stop="handleMouseDown">
        <CsLine :data="document" />
        <CsPage :data="document" @mousedown="handleMouseDown" @mouseup="handleMouseUp"/>
      </div>
      <div class="navigation">
        123
      </div>
    </div>
    <div class="settings">

    </div>
  </div>
</template>

<script>
import CDocument from '@/common/classes/Document'
import CParagraph from '@/common/classes/Paragraph'
import CFragment from '@/common/classes/Fragment'
import CImage from '@/common/classes/Image'

import CsPage from './CS_Page.vue'
import CsLine from './СS_Line.vue'
import ColorPalette from './misc/ColorPalette.vue'
import Popup from './misc/Popup.vue'

const doc = new CDocument()
const fragment = new CFragment({ parent: doc})
fragment.components.push(new CParagraph({text: 'i\'m nested paragraph',
                          parent: fragment,
                          indent: 2
                        }))

doc.components = [
  new CParagraph({text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi tempus imperdiet nulla malesuada. Nunc aliquet bibendum enim facilisis gravida neque convallis a. Rutrum tellus pellentesque eu tincidunt. Quis varius quam quisque id diam vel quam elementum.',
                 parent: doc,
                 rFontSize: [{value: 32, range: [0, 1, 2, 12, 14]}],
                 rBold: [1],
                 rItalic: [0, 4],
                 rFontColor: [{value: '#ffca02', range: [1]}]}),
  new CParagraph({text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae nisi sem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nullam rhoncus sit amet risus eget sodales. Phasellus bibendum accumsan diam vel suscipit. Maecenas semper purus tempor quam bibendum consequat. Pellentesque finibus quam euismod faucibus vulputate. Aliquam rutrum condimentum ornare. Pellentesque vestibulum eu orci sit amet gravida. Aliquam erat volutpat. Nulla lobortis, justo nec porta faucibus, elit elit sagittis nunc, sit amet cursus felis elit et ligula.',
                  parent: doc,
                  align: 'right'
                }),
  new CParagraph({text: 'few words to add',
                  parent: doc,
                  indent: 2
                }),
  fragment
]

export default {
  name: 'CsDocument',
  components: {
    CsPage,
    CsLine,
    ColorPalette,
    Popup
  },
  data() {
    return {
      document: doc,
      activeNode: null,
      selection: {
        isActive: false,
        isSelected: false,
        lines: '',
        start: {node: null, element: null, index: 0},
        end: {node: null, element: null, index: 0}
      }
    }
  },
  watch: {
    'selection.end.index'() {
      this.selection.lines = ''
    }
  },
  mounted() {
    document.addEventListener('keydown', this.handleKeys, false)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeys, false)
  },
  computed: {
    isParagraphActive() {
      return this?.activeNode?.type === 'paragraph'
    }
  },
  methods: {
    imageSize(url) {
      const img = new Image()
      return new Promise(resolve => {
        img.onload = () => {
          const { width, height } = img
          resolve({width, height})
        }
        img.src = url
      });
    },
    addImage(data) {
      this.addComponent(new CImage(data))
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
      const index = parent.components.indexOf(node)
      data.parent = parent
      parent.components.splice(index + 1, 0, data)
    },
    setImageData(e) {
      const { files, value } = e.target
      if (!value) return
      const file = files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = async () => {
        const imageData = reader.result
        const measures = await this.imageSize(imageData)
        this.addImage({
          imageData,
          ...measures
        })
      }
      reader.readAsDataURL(file)
      e.target.value = ''
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
      this.selection.start.node = null
      this.selection.isSelected = false
      this.selection.isActive = true
    },
    removeKey(forward = false) {
      if (!this.isParagraphActive) return
      this.activeNode.removeKey(forward)
    },
    async pasteText() {
      if (!this.isParagraphActive) return
      const clipboard = await navigator.clipboard.readText()
      if (!clipboard) return
      this.activeNode.printText(clipboard)
    },
    typeText(key) {
      if (!this.isParagraphActive) return
      this.activeNode.printKey(key)
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
          this.removeKey()
          break;
        case 'Delete':
          this.removeKey(true)
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
      getActiveNode: () => this.activeNode
    }
  }
};
</script>

<style lang="scss" scoped>
  .document {
    height: 100%;
    display: grid;
    grid-template: 1fr / 1fr minmax(400px, 500px);
    >.view {
      grid-area: 1 / 1 / span 1 / span 1;
      border-top: 1px solid var(--border_color_1);
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
      grid-area: 1 / 2 / span 1 / span 1;
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
</style>
