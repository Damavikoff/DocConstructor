<template>
  <div class="image" :style="outStyles">
    <div class="content" :style="contentStyles">
      <img :src="data.imageData" alt="image_data" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'VwImage',
  props: {
    data: Object
  },
  computed: {
    outStyles() {
      const { paddingsPx } = this.data
      return {
        'padding': paddingsPx.map(el => `${el}px`).join(' ')
      }
    },
    contentStyles() {
      return {
        width: `${this.data.width}px`,
        height: `${this.data.height}px`
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .image {
    overflow: hidden;
    .content {
      display: flex;
      width: fit-content;
      border: 1px solid transparent;
      >img {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
