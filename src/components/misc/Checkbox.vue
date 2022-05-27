<template>
  <div class="ui checkbox">
    <input type="checkbox" v-model="value" />
    <label>{{label}}</label>
  </div>
</template>

<script>
export default {
  name: 'checkbox',
  props: ['label', 'modelValue'],
  emits: ['update:modelValue'],
  mounted: function() {
    $(this.$el).checkbox();
  },
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}
</script>

<style lang="scss">

</style>