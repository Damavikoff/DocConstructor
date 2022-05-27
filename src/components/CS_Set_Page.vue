<template>
  <div class="ui basic fitted segment" :class="{active: active}">
    <div class="ui mini horizontal divider fluid header" :class="{grey: !active}">
      <i class="file alternate outline icon"></i>
      <div class="content">Страница</div>
    </div>
    <div class="ui tiny form">
      <div class="field">
        <div class="ui tiny grey header">
          <div class="content">Отступы</div>
        </div>
        <div class="content">
          <div class="four fields">
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CsSetPage',
  props: {
    data: Object,
    active: Boolean
  },
  methods: {
    getParsedNumber(value) {
      const parsed = Number(value)
      return parsed ? parsed : 0
    }
  },
  computed: {
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

  .divider {
    margin-bottom: .7em !important;
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
