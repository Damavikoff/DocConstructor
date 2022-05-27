<template>
  <slot name="trigger" />
  <div class="ui popup">
    <slot name="content" />
  </div>
</template>

<script>
export default {
    name: 'popup',
    props: {
			position: String,
			hover: Boolean
		},
    data() {
			return {
				sPosition: this.position ?? 'top center',
				sHover: this.hover ? 'hover' : 'click'
			}
    },
    mounted: function() {
			$(this.$el).next().popup({
				inline     : true,
				hoverable  : true,
				position   : this.sPosition,
				on: this.sHover,
				delay: {
				show: 300,
				hide: 300
				}
			});
    }
}
</script>

<style lang="scss" scoped>
  .ui.popup {
    padding: 0;
  }
</style>