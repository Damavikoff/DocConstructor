<template>
  <div class="page" :style="pageStyles" @click="handleMouseDown">
    <template v-for="(item, key) in document.components">
      <CsParagraph :data="item" :key="item.id" v-if="item.type === 'paragraph'" />
      <CsFragment :data="item" :key="item.id" v-else-if="item.type === 'fragment'" />
      <CsImage :data="item" :key="item.id" v-else-if="item.type === 'image'" />
      <CsList :data="item" :key="item.id" v-else-if="item.type === 'list'" />
      <CTable :data="item" :key="item.id" v-else-if="item.type === 'table'" />
    </template>
  </div>
</template>

<script>
import CsParagraph from './CS_Paragraph';
import CsFragment from './CS_Fragment';
import CsImage from './CS_Image';
import CsList from './CS_List';
import CTable from './CS_Table';

export default {
  name: 'CsPage',
  components: {
    CsParagraph,
    CsFragment,
    CsImage,
    CsList,
    CTable
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
