<template>
  <div class="ui basic fitted segment" :class="outClasses">
    <div class="slightly relaxed flex">
      <div class="ui mini horizontal divider fluid header" :class="{grey: !active}">
        <i class="pencil alternate icon"></i>
        <div class="content">Поле ввода</div>
      </div>
      <i class="grey trash alternate outline link icon" title="Удалить" @click="remove"></i>
    </div>
    <div class="ui tiny form">
      <div class="field">
        <div class="field">
          <label>Заголовок</label>
          <input type="text" placeholder="..." v-model.lazy="data.title" />
        </div>
        <div class="field">
          <label>Описание</label>
          <input type="text" placeholder="..." v-model.lazy="data.description" />
        </div>
      </div>
      <div class="field">
        <div class="ui tiny grey header">
          <div class="content">Шрифт</div>
        </div>
        <div class="content">
          <div class="fields">
            <div class="four wide field">
              <label>Размер</label>
              <Dropdown class="tiny font-size" :list="fontSizeList" :modelValue="activeFontSize" @update:modelValue="setFontSize" :reselection="true" />
            </div>
            <div class="fluid field">
              <label>Шрифт</label>
              <Dropdown class="tiny font-family" :list="fontList" :modelValue="activeFont" @update:modelValue="setFontFamily" :reselection="true" />
            </div>
            <div class="three wide field">
              <label>Позиция</label>
              <input type="text" placeholder="..." v-model.lazy="position" />
            </div>
          </div>
          <div class="fields">
            <div class="centered field">
              <Popup position="right center">
                <template v-slot:trigger>
                  <i class="fitted bordered tint link icon" :style="colorStyle"></i>
                </template>
                <template v-slot:content>
                  <ColorPalette :value="data.fontColor" @update="setColor" />
                </template>
              </Popup>
              <i class="fitted bordered bold link icon" :class="{lightyellow: data.bold}" @click="data.bold = !data.bold"></i>
              <i class="fitted bordered italic link icon" :class="{lightyellow: data.italic}" @click="data.italic = !data.italic"></i>
              <i class="fitted bordered underline link icon" :class="{lightyellow: data.underline}" @click="data.underline = !data.underline"></i>
            </div>
            <div class="centered field">
              <span class="ui large text sample" :style="textStyles">Lorem ipsum</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fonts } from '@/common/defaults'
import Dropdown from './misc/Dropdown.vue'
import Popup from './misc/Popup.vue'
import ColorPalette from './misc/ColorPalette.vue'

export default {
  name: 'CsSetParagraph',
  components: {
    Dropdown,
    Popup,
    ColorPalette
  },
  inject: ['setActiveNode'],
  props: {
    data: Object,
    active: Boolean
  },
  computed: {
    textStyles() {
      const { fontSize, fontColor, fontFamily, bold, italic, underline } = this.data
      const { fontSize:pfontSize, fontColor:pfontColor, fontFamily:pfontFamily } = this.data.parent
      return {
        'font-family': `${fontFamily ?? pfontFamily}`,
        color: fontColor ?? pfontColor,
        'text-decoration': underline ? 'underline' : 'none',
        'font-weight': bold ? 700 : 400,
        'font-style': italic ? 'italic' : 'normal'
      }
    },
    colorStyle() {
      return {
        color: this.data.fontColor ? this.data.fontColor : '#000000'
      }
    },
    outClasses() {
      return {
        active: this.active
      }
    },
    fontSizeList() {
      return Array(42).fill().map((_el, index) => { return { name: index + 7, value: index + 7 } })
    },
    fontList() {
      return fonts.map(el => { return { name: el, value: `${el}` } })
    },
    activeFontSize() {
      return this.data.fontSize
    },
    activeFont() {
      return this.data.fontFamily
    },
    position: {
      get() {
        return this.data.position
      },
      set(value) {
        const parsed = parseInt(value)
        const maxIndex = this.data.parent.text.length - 1
        this.data.position = parsed && value >= 0 && value <= maxIndex ? parsed : 0
      }
    }
  },
  methods: {
    remove() {
      this.setActiveNode(null)
      this.data.parent.components = this.data.parent.components.filter(el => el !== this.data)
    },
    setColor(value) {
      this.data.fontColor = value
    },
    setFontSize(value) {
      this.data.fontSize = value
    },
    setFontFamily(value) {
      this.data.fontFamily = value
    },
    getParsedNumber(value) {
      const parsed = Number(value)
      return parsed ? parsed : 0
    }
  }
};
</script>

<style lang="scss" scoped>

  .segment {
    &.active {
      padding-left: 1em !important;
      border-left: 2px solid #2185d0 !important;
    }
    >.flex {
      >i {
        font-size: 1.3em;
      }
    }
  }

  .divider.header {
    margin-bottom: 0.5em !important;
  }

  .field {
    >.content {
      padding: 0 .8em;
    }
    >.header {
      margin-bottom: .8em;
    }
    >input {
      padding: 0.4em 0.5em !important;
    }
    >.dropdown {
      padding-top: 0.5em !important;
      padding-left: 0.5em !important;
      padding-bottom: 0.5em !important;
      min-height: auto !important;
      >i {
        padding: 0.65em 0.6em !important;
      }
    }
  }

  i.bordered {
    font-size: 1.2em;
    &:not(:first-child) {
      margin-left: .5em !important;
    }
  }

  .palette {
    padding: 1em;
  }
</style>
