<template>
  <div class="list" :style="outStyles">
    <div class="content">
      <CsListItem :data="item" v-for="(item, key) in items" :key="item.id"/>
    </div>
  </div>
</template>

<script>
import CsListItem from './CS_ListItem.vue';

export default {
  name: 'CsList',
  components: {
    CsListItem
  },
  props: {
    data: Object
  },
  inject: ['getActiveNode', 'setActiveNode'],
  computed: {
    isActive() {
      return this.data === this.getActiveNode()
    },
    items() {
      return this.data.components
    },
    outStyles() {
      const { paddingsPx } = this.data
      return {
        'padding-left': `${paddingsPx[3]}px`,
        'padding-right': `${paddingsPx[1]}px`,
        'padding-top': `${paddingsPx[0]}px`,
        'padding-bottom': `${paddingsPx[2]}px`
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  
</style>
