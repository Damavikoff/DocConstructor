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
      <template v-for="(item, key) in data.components">
        <CsParagraph :data="item" :key="item.id" v-if="item.type === 'paragraph'" />
        <CsFragment :data="item" :key="item.id" v-else-if="item.type === 'fragment'" />
        <CsImage :data="item" :key="item.id" v-else-if="item.type === 'image'" />
        <CsTable :data="item" :key="item.id" v-else-if="item.type === 'table'" />
        <CsList :data="item" :key="item.id" v-else-if="item.type === 'list'" />
      </template>
    </div>
  </div>
</template>

<script>
import CsParagraph from './CS_Paragraph.vue';
import CsImage from './CS_Image.vue';
import CsList from './CS_List.vue';

export default {
  name: 'CsFragment',
  components: {
    CsParagraph,
    CsImage,
    CsList
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
      >.content {
        border-color: #cacaca;
      }
    }
    &.active {
      >.content {
        border-color: #2185d0;
      }
    }
    .content {
      border: 1px solid transparent;
      box-shadow: inset 0 0 0 1px #eaeaea;
      padding: 1px;
      overflow-x: clip;
    }
  }
</style>
