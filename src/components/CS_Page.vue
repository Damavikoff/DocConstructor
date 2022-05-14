<template>
  <div class="page" :style="pageStyles">
    <template v-for="(data, key) in document.components">
      <CsParagraph :data="data" :key="data.id" v-if="data.type === 'paragraph'" />
      <CsFragment :data="data" :key="data.id" v-else-if="data.type === 'fragment'" />
      <CsImage :data="data" :key="data.id" v-else-if="data.type === 'image'" />
    </template>
  </div>
</template>

<script>
import CsParagraph from './CS_Paragraph.vue';
import CsFragment from './CS_Fragment.vue';
import CsImage from './CS_Image.vue';

export default {
  name: 'CsPage',
  components: {
    CsParagraph,
    CsFragment,
    CsImage
  },
  props: {
    data: Object
  },
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
  }
};
</script>

<style lang="scss" scoped>

</style>
