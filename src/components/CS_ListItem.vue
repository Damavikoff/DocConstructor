<template>
  <div class="item">
    <div class="content">
      <CsParagraph :data="data" />
    </div>
  </div>
</template>

<script>
import CsParagraph from './CS_Paragraph.vue';

export default {
  name: 'CsListItem',
  components: {
    CsParagraph
  },
  props: {
    data: Object
  },
  inject: ['getActiveNode', 'setActiveNode'],
  computed: {
    isActive() {
      return this.data === this.getActiveNode()
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
  
</style>
