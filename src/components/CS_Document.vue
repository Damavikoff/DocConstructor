<template>
  <div class="document">
    <transition name="fade" mode="out-in">
      <Slider v-if="rulesVisible">
        <CSDocRules :data="document.rules" @keydown.stop="false" @close="rulesVisible = false" />
      </Slider>
      <Slider v-else-if="compRules.isActive">
        <CSComponentRules :data="compRules" @keydown.stop="false" @close="compRules.isActive = false" />
      </Slider>
    </transition>
    <div class="ui secondary compact fitted borderless header menu">
      <div class="item">
        <div class="ui small header">
          <i class="teal file alternate icon"></i>
          <div class="content">{{document.title.trim() ? document.title : 'Новый документ'}}</div>
        </div>
      </div>
      <div class="right item">
        <div class="ui tiny lightyellow labeled icon button">
          Сохранить
          <i class="layer group icon"></i>
        </div>
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
              <span class="ui basic link text"><i class="file alternate outline icon"></i>Шаблон</span>
            </template>
            <template v-slot:content>
              <div class="insert-menu">
                <div class="ui left aligned tiny secondary vertical menu">
                  <a class="item">
                    <div class="relaxed flex">
                      <span class="ui fluid text">Сохранить</span>
                      <i class="save icon"></i>
                    </div>
                  </a>
                  <a class="item">
                    <div class="relaxed flex">
                      <span class="ui fluid text">Создать копию</span>
                      <i class="layer group icon"></i>
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
        <div class="item">
          <Popup position="bottom left">
            <template v-slot:trigger>
              <span class="ui basic link text" :class="{disabled: !isInsertable}"><i class="copy outline icon"></i>Вставка</span>
            </template>
            <template v-slot:content>
              <div class="insert-menu">
                <div class="ui left aligned tiny secondary vertical menu">
                  <template v-if="activeType !== 'listItem'">
                    <a class="item" @click="$refs.imagePicker.click()">
                      <div class="relaxed flex">
                        <span class="ui fluid text">Изображение</span>
                        <i class="image outline icon"></i>
                      </div>
                    </a>
                    <a class="item" @click="addList">
                      <div class="relaxed flex">
                        <span class="ui fluid text">Список</span>
                        <i class="list ul icon"></i>
                      </div>
                    </a>
                    <a class="item" @click="addTable">
                      <div class="relaxed flex">
                        <span class="ui fluid text">Таблица</span>
                        <i class="th icon"></i>
                      </div>
                    </a>
                    <a class="item" @click="addFragment">
                      <div class="relaxed flex">
                        <span class="ui fluid text">Фрагмент</span>
                        <i class="expand icon"></i>
                      </div>
                    </a>
                  </template>
                  <a class="item" v-if="isParagraphActive" @click="addField">
                    <div class="relaxed flex">
                      <span class="ui fluid text">Поле ввода</span>
                      <i class="pencil alternate icon"></i>
                    </div>
                  </a>
                </div>
              </div>
            </template>
          </Popup>
        </div>
        <div class="item">
          <span class="ui basic link text" @click="rulesVisible = true"><i class="ul list icon"></i>Правила</span>
        </div>
      </div>
      <div class="control menu">
        <div class="item" :class="{disabled: !isNodeAlignable}">
          <input type="file" accept="image/*" ref="imagePicker" hidden @change="setImageData"/>
          <i class="large align left link icon" @click="setAlign('left')" :class="alignIconClass.left"></i>
          <i class="large align center link icon" @click="setAlign('center')" :class="alignIconClass.center"></i>
          <i class="large align right link icon" @click="setAlign('right')" :class="alignIconClass.right"></i>
          <i class="large align justify link icon" @click="setAlign('justify')" :class="alignIconClass.justify"></i>
        </div>
        <div class="item" :class="{disabled: !isParagraphActive}">
          <i class="bordered bold link icon" @click="setBold"></i>
          <i class="bordered italic link icon" @click="setItalic"></i>
          <i class="bordered underline link icon" @click="setUnderline"></i>
          <i class="bordered paragraph link icon" @click="settings.showParagraphs = !settings.showParagraphs" :class="settings.showParagraphs ? 'red' : 'grey'"></i>
        </div>
        <div class="item" :class="{disabled: !isParagraphActive}">
          <Popup position="bottom left">
            <template v-slot:trigger>
              <i class="fitted bordered tint link icon"></i>
            </template>
            <template v-slot:content>
              <ColorPalette :value="null" @update="setColor" />
            </template>
          </Popup>
        </div>
        <div class="item" :class="{disabled: !isParagraphActive}">
          <Dropdown class="tiny font-size" :list="fontSizeList" :modelValue="activeFontSize" @update:modelValue="setFontSize" :reselection="true" />
        </div>
        <div class="item" :class="{disabled: !isParagraphActive}">
          <Dropdown class="tiny font-family" :list="fontList" :modelValue="activeFont" @update:modelValue="setFontFamily" :reselection="true" />
        </div>
        <div class="item" :class="{disabled: !isParagraphActive}">
          <Popup position="bottom right">
            <template v-slot:trigger>
              <i class="bordered text height link icon"></i>
            </template>
            <template v-slot:content>
              <div class="ui tiny segment">
                <div class="ui tiny secondary vertical lightyellow font-lineheight menu">
                  <a class="item" v-for="(data, key) in intervalList" :class="{ active: this.activeInterval === data.value }" @click="setInterval(data.value)">{{data.name}}</a>
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
    </div>
    <div class="settings" @keydown.stop="false">
      <div class="ui fluid basic segments">
        <div class="ui horizontally fitted segment">
          <div class="ui tiny header">
            <i class="cog icon"></i>
            <div class="content">Настройки компонентов</div>
          </div>
        </div>
        <div class="ui horizontally fitted segment">
          <CSetDocument :data="document" />
        </div>
        <div class="ui fluid horizontally fitted segment">
          <div class="fluid container">
              <div class="scrolling absolute">
                <CSetField :data="activeNode" v-if="activeType === 'field'" :active="true" />
                <CSetParagraph :data="activeNode.parent" v-if="parentType === 'paragraph'" :active="false" />
                <CSetParagraph :data="activeNode" v-else-if="isParagraphActive" :active="true" />
                <CSetImage :data="activeNode" v-if="activeType === 'image'" :active="true" />
                <CSetFragment :data="activeNode.parent" v-if="parentType === 'fragment'" :active="false" />
                <CSetFragment :data="activeNode" v-else-if="activeType === 'fragment'" :active="true" />
                <CSetTableCell :data="activeNode.parent" v-if="parentType === 'tableCell'" :active="false" />
                <CSetTable :data="activeNode" v-if="activeType === 'table'" :active="true" />
                <CSetTable :data="activeNode.parent.table" v-else-if="parentType === 'tableCell'" :active="false" />
                <CSetList :data="activeNode.parent" v-if="parentType === 'list'" :active="false" />
                <CSetList :data="activeNode" v-else-if="activeType === 'list'" :active="true" />
                <CSetPage :data="document" :active="false" />
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fonts } from '@/common/defaults'

import CParagraph from '@/common/classes/Paragraph'
import CFragment from '@/common/classes/Fragment'
import CImage from '@/common/classes/Image'
import CField from '@/common/classes/Field'
import CList from '@/common/classes/List'
import CListItem from '@/common/classes/ListItem'
import CTable from '@/common/classes/Table'
import CTableRow from '@/common/classes/TableRow'
import CTableCell from '@/common/classes/TableCell'

import CsPage from './CS_Page.vue'
import CsLine from './СS_Line.vue'
import CSetDocument from './CS_Set_Document'
import CSetParagraph from './CS_Set_Paragraph'
import CSetFragment from './CS_Set_Fragment'
import CSetList from './CS_Set_List'
import CSetImage from './CS_Set_Image'
import CSetField from './CS_Set_Field'
import CSetTable from './CS_Set_Table'
import CSetTableCell from './CS_Set_TableCell'
import CSetPage from './CS_Set_Page'
import CSDocRules from './CS_DocRules'
import CSComponentRules from './CS_ComponentRules'

import ColorPalette from './misc/ColorPalette.vue'
import Dropdown from './misc/Dropdown.vue'
import Popup from './misc/Popup.vue'
import Slider from './misc/Slider.vue'

export default {
  name: 'CsDocument',
  components: {
    CsPage,
    CsLine,
    CSetDocument,
    CSetParagraph,
    CSetList,
    CSetImage,
    CSetFragment,
    CSetField,
    CSetPage,
    CSetTable,
    CSetTableCell,
    CSDocRules,
    CSComponentRules,
    ColorPalette,
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
      selection: {
        isActive: false,
        isSelected: false,
        lines: '',
        start: {node: null, element: null, index: 0},
        end: {node: null, element: null, index: 0},
        components: []
      },
      settings: {
        showParagraphs: true
      },
      rulesVisible: false,
      compRules: {
        isActive: false,
        component: null,
        rules: this.data.rules
      }
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
    alignIconClass() {
      return Object.fromEntries(['left', 'center', 'right', 'justify'].map(el => [el, this.activeAlign === el ? 'blue' : 'grey']))
    },
    isParagraphActive() {
      return ['paragraph', 'listItem'].includes(this?.activeNode?.type)
    },
    isNodeAlignable() {
      return this.activeNode && ['paragraph'].includes(this.activeNode.type)
    },
    activeAlign() {
      return this?.activeNode?.align
    },
    fontSizeList() {
      return Array(42).fill().map((_el, index) => { return { name: index + 7, value: index + 7 } })
    },
    fontList() {
      return fonts.map(el => { return { name: el, value: `${el}` } })
    },
    intervalList() {
      return [
        { name: '1.0', value: 1 },
        { name: '1.15', value: 1.15 },
        { name: '1.5', value: 1.5 },
        { name: '2.0', value: 2 },
        { name: '2.5', value: 2.5 },
        { name: '3.0', value: 3 },
      ]
    },
    activeInterval() {
      return this.isParagraphActive ? this.activeNode.lineHeight : this.intervalList[0]?.value 
    },
    activeFontSize() {
      return this.isParagraphActive ? this.activeNode.fontSize : this.fontSizeList[0]?.value
    },
    activeFont() {
      return this.isParagraphActive ? this.activeNode.fontFamily : this.fontList[0]?.value
    },
    activeType() {
      return this.activeNode?.type
    },
    parentType() {
      return this.activeNode?.parent?.type
    },
    isInsertable() {
      return this.activeType && !['field'].includes(this.activeType)
    }
  },
  methods: {
    loadFonts() {
      this.fontList.forEach(el => {
        document.fonts.load(`14px ${el.value}`)
      })
    },
    setInterval(value) {
      if (this.isParagraphActive) this.activeNode.lineHeight = value
    },
    setColor(value) {
      this.setValueStyle('rFontColor', value)
    },
    setFontSize(value) {
      this.setValueStyle('rFontSize', value)
    },
    setFontFamily(value) {
      this.setValueStyle('rFontFamily', value)
    },
    setValueStyle(type, value) {
      const { isSelected, components } = this.selection
      if (isSelected) {
        components.forEach(el => el.target.setValueStyle(type, el.range, value))
        this.selection.isSelected = false
        return
      }
      if (!this.isParagraphActive) return
      const paragraph = this.activeNode
      if (type === 'rFontFamily') paragraph.setFontStyle('fontFamily', value)
      else if (type === 'rFontColor') paragraph.setFontStyle('fontColor', value)
      else if (type === 'rFontSize') paragraph.setFontStyle('fontSize', value)
    },
    setBold() {
      this.setStyle('rBold')
    },
    setItalic() {
      this.setStyle('rItalic')
    },
    setUnderline() {
      this.setStyle('rUnderline')
    },
    setStyle(type) {
      const { isSelected, components } = this.selection
      if (!isSelected) return
      let isAllSet = true
      for (const val of components) {
        isAllSet = !val.range.some(el => !val.target[type].includes(el))
        if (!isAllSet) break
      }
      components.forEach(el => el.target.setStyle(type, el.range, isAllSet))
      this.selection.isSelected = false
    },
    setAlign(align) {
      this.activeNode.align = align
    },
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
    addList() {
      const list = new CList()
      const item = new CListItem({parent: list, indent: -1, paddings: [0, 0, 0, 1]})
      list.components = [item]
      if (this.activeType === 'document') {
        this.activeNode.components.push(list)
        return
      }
      this.addComponent(list)
    },
    addField() {
      if (!this.isParagraphActive) return
      const { caretPosition, components } = this.activeNode
      const hasInput = components.find(el => el.position === caretPosition)
      const pos = hasInput ? caretPosition + 1 : caretPosition
      const field = new CField({title: 'Поле', position: pos, parent: this.activeNode})
      components.push(field)
    },
    addFragment() {
      const fragment = new CFragment()
      fragment.components.push(new CParagraph({parent: fragment,
                                indent: 1
                              }))
      this.addComponent(fragment)
    },
    addTable() {
      const table = new CTable()
      Array(2).fill().forEach(el => {
        const tableRow = new CTableRow({parent: table})
        const tc1 = new CTableCell({parent: tableRow, minWidth: 190})
        tc1.components = [
          new CParagraph({parent: tc1,
                          indent: 0
                        })
        ]
        const tc2 = new CTableCell({parent: tableRow, minWidth: 190})
        tc2.components = [
          new CParagraph({parent: tc2,
                          indent: 0
                        })
        ]
        tableRow.components = [tc1, tc2]
        table.components.push(tableRow)
      })
      this.addComponent(table)
      const cCell = this.activeNode.closestTableCell
      if (cCell) {
        cCell.updateParentCells(380)
      }
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
      data.parent = parent
      parent.components.splice(node.index + 1, 0, data)
      this.activeNode = data
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
          ...measures,
          nativeWidth: measures.width,
          nativeHeight: measures.height
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
      this.selection.components = []
      this.selection.start.node = null
      this.selection.isSelected = false
      this.selection.isActive = true
    },
    addParagraph() {
      if (!this.isParagraphActive) return
      const { caretPosition, caretBefore, text, lineHeight, indent, fontColor, fontFamily, fontSize, align, parent, type, paddings } = this.activeNode
      const index = caretBefore ? caretPosition : caretPosition + 1
      const cBefore = text.slice(0, index)
      const cAfter = text.slice(index)

      this.activeNode.text = cBefore
      this.activeNode.caretPosition = 0

      const rBold = this.activeNode.getStyleChunk('rBold', index)
      const rItalic = this.activeNode.getStyleChunk('rItalic', index)
      const rUnderline = this.activeNode.getStyleChunk('rUnderline', index)

      const rFontSize = this.activeNode.getStyleChunk('rFontSize', index)
      const rFontColor = this.activeNode.getStyleChunk('rFontColor', index)
      const rFontFamily = this.activeNode.getStyleChunk('rFontFamily', index)

      this.activeNode.cutStyles(index)
      const options = {text: cAfter,
        lineHeight,
        indent,
        rBold,
        rItalic,
        rUnderline,
        rFontSize,
        rFontColor,
        rFontFamily,
        fontColor,
        fontFamily,
        fontSize,
        align,
        parent,
        paddings: [...paddings]
      }

      let paragraph = new CParagraph(options)
      if (type === 'listItem') {
        paragraph = new CListItem(options)
      }
      this.addComponent(paragraph)

    },
    removeKey(forward = false) {
      if (!this.isParagraphActive) return
      this.activeNode.removeKey(forward)
      if (this.activeNode.parent.components.indexOf(this.activeNode) < 0) this.activeNode = null 
    },
    removeSelection() {
      const { components } = this.selection
      this.activeNode = null
      for (let component of components) {
        const { target, range } = component
        const { text, parent } = target
        target.text = text.split('').filter((_el, idx) => !range.includes(idx)).join('')
        if (!target.text.length && target.isNotAlone && (parent.components.length > 1 || ['list', 'fragment'].includes(parent.type))) {
          target.remove()
        } else {
          const rangeSorted = range.sort((a, b) => a - b)
          target.removeShiftStyles(range.length, rangeSorted[0], false)
        }
        if (['list', 'fragment'].includes(parent.type) && !parent.components.length) {
          parent.remove()
        }
      }
      this.selection.isSelected = false
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
      getSettings: () => this.settings,
      getSelection: () => this.selection,
      setActiveNode: (node) => this.activeNode = node,
      getActiveNode: () => this.activeNode,
      setComponentRules: (data) => {
        if (!this.document.rules.length) {
          this.toastus('Нет правил для добавления', 'error')
          return
        }
        this.compRules.component = data
        this.compRules.isActive = true 
      }
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
