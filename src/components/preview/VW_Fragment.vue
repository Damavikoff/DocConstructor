<template>
  <div class="fragment" :style="outStyles" :class="outClasses">
    <div class="content">
      <template v-for="(item, key) in data.components">
        <VwParagraph :data="item" :key="item.id" v-if="item.type === 'paragraph'" />
        <VwFragment :data="item" :key="item.id" v-else-if="item.type === 'fragment'" />
        <VwImage :data="item" :key="item.id" v-else-if="item.type === 'image'" />
        <VwTable :data="item" :key="item.id" v-else-if="item.type === 'table'" />
        <VwList :data="item" :key="item.id" v-else-if="item.type === 'list'" />
      </template>
    </div>
  </div>
</template>

<script>
import VwParagraph from './VW_Paragraph.vue';
import VwImage from './VW_Image.vue';
import VwList from './VW_List.vue';

export default {
  name: 'VwFragment',
  components: {
    VwParagraph,
    VwImage,
    VwList
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
    .content {
      overflow-x: clip;
    }
  }
</style>
