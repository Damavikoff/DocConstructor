<template>
  <div class="page" :style="pageStyles">
    <template v-for="(data, key) in document.components">
      <Paragraph :data="data" :key="data.id" v-if="data.type === 'paragraph'" />
    </template>
  </div>
</template>

<script>
import Paragraph from './CS_Paragraph.vue';

export default {
  name: 'CsPage',
  components: {
    Paragraph,
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
      const { paddings, pageMeasures } = this.document
      const { width, height } = pageMeasures
      return {
        'width': `${width}px`,
        'height': `${height}px`,
        'padding': paddings.map(el => `${el}px`).join(' ')
      }
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
