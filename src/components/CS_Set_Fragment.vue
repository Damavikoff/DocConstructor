<template>
  <div class="ui basic fitted segment" :class="outClasses">
    <div class="slightly relaxed flex">
      <div class="ui mini horizontal divider fluid header" :class="{grey: !active}">
        <i class="expand icon"></i>
        <div class="content">Фрагмент</div>
      </div>
      <i class="grey list link icon" title="Правила" @click="setComponentRules(data)"></i>
      <i class="grey trash alternate outline link icon" title="Удалить" @click="remove"></i>
    </div>
    <div class="ui tiny form">
      <div class="field">
        <div class="ui tiny grey header">
          <div class="content">Отступы</div>
        </div>
        <div class="content">
          <div class="four fields">
            <div class="field">
              <label>Верхний</label>
              <input type="text" placeholder="..." v-model.lazy="paddingTop" />
            </div>
            <div class="field">
              <label>Нижний</label>
              <input type="text" placeholder="..." v-model.lazy="paddingBottom" />
            </div>
            <div class="field">
              <label>Правый</label>
              <input type="text" placeholder="..." v-model.lazy="paddingRight" />
            </div>
            <div class="field">
              <label>Левый</label>
              <input type="text" placeholder="..." v-model.lazy="paddingLeft" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CsSetDocument',
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
