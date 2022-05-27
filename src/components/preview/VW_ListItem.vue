<template>
  <div class="item">
    <div class="content">
      <VwParagraph :data="data" />
    </div>
  </div>
</template>

<script>
import VwParagraph from './VW_Paragraph.vue';

export default {
  name: 'VwListItem',
  components: {
    VwParagraph
  },
  props: {
    data: Object
  },
};
</script>

<style lang="scss" scoped>
  
</style>
