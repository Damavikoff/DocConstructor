<template>
  <div class="ui basic fitted segment" :class="outClasses">
    <div class="slightly relaxed flex">
      <div class="ui mini horizontal divider fluid header" :class="{grey: !active}">
        <i class="bars icon" v-if="data.type === 'paragraph'"></i>
        <i class="check double icon" v-else></i>
        <div class="content">{{data.type === 'paragraph' ? 'Параграф' : 'Пункт'}}</div>
      </div>
      <i class="grey list link icon" title="Правила" @click="setComponentRules(data)"></i>
      <i class="grey trash alternate outline link icon" title="Удалить" @click="remove" v-if="data.isNotAlone"></i>
    </div>
    <div class="ui tiny form">
      <div class="field">
        <div class="ui tiny grey header">
          <div class="content">Текст</div>
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
              <label>Интервал</label>
              <input type="text" placeholder="..." v-model.lazy="activeInterval" />
            </div>
          </div>
        </div>
      </div>
      <div class="field">
        <div class="ui tiny grey header">
          <div class="content">Отступы</div>
        </div>
        <div class="content">
          <div class="five fields">
            <div class="field">
              <label>Сверху</label>
              <input type="text" placeholder="..." v-model.lazy="paddingTop" />
            </div>
            <div class="field">
              <label>Снизу</label>
              <input type="text" placeholder="..." v-model.lazy="paddingBottom" />
            </div>
            <div class="field">
              <label>Справа</label>
              <input type="text" placeholder="..." v-model.lazy="paddingRight" />
            </div>
            <div class="field">
              <label>Слева</label>
              <input type="text" placeholder="..." v-model.lazy="paddingLeft" />
            </div>
            <div class="field">
              <label>Параграф</label>
              <input type="text" placeholder="..." v-model.lazy="indent" />
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
import ColorPalette from './misc/ColorPalette.vue'

export default {
  name: 'CsSetParagraph',
  components: {
    Dropdown,
    ColorPalette
  },
  inject: ['setActiveNode', 'setComponentRules'],
  props: {
    data: Object,
    active: Boolean
  },
  computed: {
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
    activeInterval: {
      get() {
        return this.data.lineHeight
      },
      set(value) {
        const parsed = parseFloat(value)
        this.data.lineHeight = parsed && parsed >= 1 ? parsed : 1
      }
    },
    paddingLeft: {
      get() {
        return this.data.paddings[3]
      },
      set(value) {
        this.data.paddings[3] = this.getParsedNumber(value)
      }
    },
    paddingRight: {
      get() {
        return this.data.paddings[1]
      },
      set(value) {
        this.data.paddings[1] = this.getParsedNumber(value)
      }
    },
    paddingTop: {
      get() {
        return this.data.paddings[0]
      },
      set(value) {
        this.data.paddings[0] = this.getParsedNumber(value)
      }
    },
    paddingBottom: {
      get() {
        return this.data.paddings[2]
      },
      set(value) {
        this.data.paddings[2] = this.getParsedNumber(value)
      }
    },
    indent: {
      get() {
        return this.data.indent
      },
      set(value) {
        this.data.indent = this.getParsedNumber(value)
      }
    }
  },
  methods: {
    remove() {
      this.setActiveNode(null)
      this.data.parent.components = this.data.parent.components.filter(el => el !== this.data)
    },
    setFontSize(value) {
      this.data.fontSize = value
      this.data.components.forEach(el => el.fontSize = value)
    },
    setFontFamily(value) {
      this.data.fontFamily = value
      this.data.components.forEach(el => el.fontFamily = value)
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
</style>
