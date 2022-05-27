<template>
  <div class="page" :style="pageStyles" @click="handleMouseDown">
    <template v-for="(item, key) in document.components">
      <VwParagraph :data="item" :key="item.id" v-if="item.type === 'paragraph'" />
      <VwFragment :data="item" :key="item.id" v-else-if="item.type === 'fragment'" />
      <VwImage :data="item" :key="item.id" v-else-if="item.type === 'image'" />
      <VwList :data="item" :key="item.id" v-else-if="item.type === 'list'" />
      <VwTable :data="item" :key="item.id" v-else-if="item.type === 'table'" />
    </template>
  </div>
</template>

<script>
import VwParagraph from './VW_Paragraph';
import VwFragment from './VW_Fragment';
import VwImage from './VW_Image';
import VwList from './VW_List';
import VwTable from './VW_Table';

export default {
  name: 'VwPage',
  components: {
    VwParagraph,
    VwFragment,
    VwImage,
    VwList,
    VwTable
  },
  props: {
    data: Object
  },
  inject: ['getActiveNode', 'setActiveNode', 'getSelection'],
  data() {
    return {
      document: this.data
    }
  },
  computed: {
    pageStyles() {
      const { paddingsPx, pageMeasures } = this.document
      const { width, height } = pageMeasures
      return {
        'width': `${width}px`,
        'min-height': `${height}px`,
        'padding': paddingsPx.map(el => `${el}px`).join(' ')
      }
    }
  },
  methods: {
    handleMouseDown(e) {
      if (e.target !== this.$el || this.getSelection().isSelected) return
      this.setActiveNode(this.data)
    }
  }
};
</script>

<style lang="scss" scoped>
  .page {
    overflow: hidden;
  }
</style>
