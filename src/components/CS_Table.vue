<template>
  <div class="table" :style="outStyles" :class="outClasses">
    <div class="content">
      <div class="control">
        <div class="ui lightyellow icon button" @click="setActiveNode(this.data)">
          <i class="crosshairs icon"></i>
        </div>
        <div class="ui lightyellow icon button" @click="remove">
          <i class="trash alternate outline icon"></i>
        </div>
      </div>
      <CsTableRow v-for="(item, key) in data.components" :data="item" :key="item.id" />
    </div>
  </div>
</template>

<script>
import CsTableRow from './CS_TableRow.vue';

export default {
  name: 'CsTable',
  components: {
    CsTableRow
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
  .table {
    padding: 1px;
    .content {
      width: min-content;
      padding: 1px;
      border: 1px solid transparent;
      >.control {
        display: none;
        position: absolute;
        text-align: left;
        bottom: 100%;
        z-index: 20;
        left: 0;
        padding-bottom: 3px;
        >.button {
          font-size: .8em;
          padding: .5em !important;
          &:last-child {
            margin-right: 0 !important;
          }
        }
      }
    }
    &:hover {
      >.content {
        border-color: #cacaca;
        >.control {
          display: block;
        }
      }
    }
    &.active {
      >.content {
        border-color: #2185d0
      }
    }
  }
</style>
