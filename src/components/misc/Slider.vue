<template>
  <div class="light dimmed absolute" :class="{visible: isVisible}">
    <div class="container" @mousedown.stop="hide">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'slider',
  data() {
    return {
      isVisible: false
    }
  },
  mounted() {
    let self = this
    setTimeout(() => {
      self.isVisible = true
    }, 100)
  },
  methods: {
    hide(e) {
      if (e.target !== $(this.$el).children('.container').get(0))
        return;
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
  .absolute {
    &.transparent {
      background: none;
    }
    overflow: hidden;
    z-index: 1000;
    &.fitted {
      >.container {
        padding: 0;
      }
    }
    >.container {
        left: 100%;
        height: 100%;
        padding: 1em;
        display: flex;
        justify-content: flex-end;
        transition: .5s all ease;
    }
    &.right {
      >.container {
        left: auto;
        right: 100%;
        justify-content: flex-start;
      }
    }
    &.visible {
        >.container {
            left: 0;
        }
        &.right {
          >.container {
            right: 0;
            left: auto;
          }
        }
    }
  }
</style>