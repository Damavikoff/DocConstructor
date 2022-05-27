<template>
  <div class="ui basic fitted segment" :class="outClasses">
    <div class="slightly relaxed flex">
      <div class="ui mini horizontal divider fluid header" :class="{grey: !active}">
        <i class="image outline icon"></i>
        <div class="content">Изображение</div>
      </div>
      <i class="grey list link icon" title="Правила" @click="setComponentRules(data)"></i>
      <i class="grey trash alternate outline link icon" title="Удалить" @click="remove"></i>
    </div>
    <div class="ui tiny form">
      <div class="field">
        <div class="ui tiny grey header">
          <div class="content">Общее</div>
        </div>
        <div class="content">
          <div class="four fields">
            <div class="field">
              <label>Ширина</label>
              <input type="text" placeholder="..." v-model.lazy="imageWidth" />
            </div>
            <div class="field">
              <label>Высота</label>
              <input type="text" placeholder="..." v-model.lazy="imageHeight" />
            </div>
          </div>
          <div class="field">
            <Checkbox label="Сохранять пропорции" v-model="data.preserveScale" />
          </div>
        </div>
      </div>
      <div class="field">
        <div class="ui tiny grey header">
          <div class="content">Отступы</div>
        </div>
        <div class="content">
          <div class="four fields">
            <div class="field">
              <div class="field">
                <label>Слева</label>
                <input type="text" placeholder="..." v-model.lazy="paddingLeft" />
              </div>
            </div>
            <div class="field">
              <label>Сверху</label>
              <input type="text" placeholder="..." v-model.lazy="paddingTop" />
            </div>
            <div class="field">
              <label>Снизу</label>
              <input type="text" placeholder="..." v-model.lazy="paddingBottom" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fromPxToCm, fromCmToPx  } from '@/common/utils'
import Checkbox from './misc/Checkbox.vue'

export default {
  name: 'CsSetDocument',
  components: {
    Checkbox
  },
  inject: ['setActiveNode', 'setComponentRules'],
  props: {
    data: Object,
    active: Boolean
  },
  methods: {
    remove() {
      this.setActiveNode(null)
      this.data.parent.components = this.data.parent.components.filter(el => el !== this.data)
    },
    getParsedNumber(value) {
      const parsed = Number(value)
      return parsed ? parsed : 0
    }
  },
  computed: {
    outClasses() {
      return {
        active: this.active
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
    imageWidth: {
      get() {
        const width = fromPxToCm(this.data.width)
        return Math.round(width * 100) / 100
      },
      set(value) {
        const parsed = parseFloat(value)
        const { nativeWidth, nativeHeight, preserveScale } = this.data
        const ratio = nativeWidth / nativeHeight
        this.data.width = parsed ? fromCmToPx(value) : 1
        this.data.height = preserveScale ? this.data.width / ratio : this.data.height
      }
    },
    imageHeight: {
      get() {
        const width = fromPxToCm(this.data.height)
        return Math.round(width * 100) / 100
      },
      set(value) {
        const parsed = parseFloat(value)
        const { nativeWidth, nativeHeight, preserveScale } = this.data
        const ratio = nativeWidth / nativeHeight
        this.data.height = parsed ? fromCmToPx(value) : 1
        this.data.width = preserveScale ? this.data.height * ratio : this.data.width
      }
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
