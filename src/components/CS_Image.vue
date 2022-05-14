<template>
  <div class="image" :style="outStyles" :class="outClasses">
    <div class="control">
      <div class="ui lightyellow icon button" @click="remove">
        <i class="trash alternate outline icon"></i>
      </div>
    </div>
    <div class="content" @click="setActiveNode(data)">
      <img :src="data.imageData" alt="image_data" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'CsImage',
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
  .image {
    &.active {
      .content {
        box-shadow: 0 0 0 1px #2185d0;
      }
    }
    &:hover {
      .control {
        display: block;
      }
    }
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
      left: 0;
      padding-bottom: 3px;
    }
    .content {
      display: flex;
      width: fit-content;
    }
  }
</style>
