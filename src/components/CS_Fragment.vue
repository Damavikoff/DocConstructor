<template>
  <div class="fragment" :style="outStyles" :class="outClasses">
    <div class="control">
      <div class="ui lightyellow icon button" @click="setActiveNode(this.data)">
        <i class="crosshairs icon"></i>
      </div>
      <div class="ui lightyellow icon button" @click="remove">
        <i class="trash alternate outline icon"></i>
      </div>
    </div>
    <div class="content">
      <template v-for="(data, key) in data.components">
        <CsParagraph :data="data" :key="data.id" v-if="data.type === 'paragraph'" />
        <CsFragment :data="data" :key="data.id" v-else-if="data.type === 'fragment'" />
        <CsImage :data="data" :key="data.id" v-else-if="data.type === 'image'" />
      </template>
    </div>
  </div>
</template>

<script>
import CsParagraph from './CS_Paragraph.vue';
import CsImage from './CS_Image.vue';

export default {
  name: 'CsFragment',
  components: {
    CsParagraph,
    CsImage
  },
  props: {
    data: Object
  },
  inject: ['getActiveNode', 'setActiveNode'],
  computed: {
    isActive() {
      return this.data === this.getActiveNode()
    },
    outClasses() {
      return {
        active: this.isActive
      }
    },
    outStyles() {
      const { paddingsPx } = this.data
      return {
        'padding': paddingsPx.map(el => `${el}px`).join(' ')
      }
    }
  },
  methods: {
    remove() {
      const { components } = this.data.parent
      this.data.parent.components = components.filter(el => el !== this.data)
    }
  }
};
</script>

<style lang="scss" scoped>
  .fragment {
    .control {
      display: none;
      >.button {
        font-size: .8em;
        padding: .5em !important;
        &:last-child {
          margin-right: 0 !important;
        }
      }
      position: absolute;
      text-align: right;
      bottom: 100%;
      z-index: 20;
      right: 0;
      padding-bottom: 3px;
    }
    &:hover {
      .control {
        display: block;
      }
      box-shadow: inset 0 0 0 1px #cacaca;
    }
    &.active {
      box-shadow: inset 0 0 0 1px #2185d0;
    }
  }
</style>
