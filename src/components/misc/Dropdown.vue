<template>
	<div class="ui selection dropdown">
		<input type="hidden" />
		<div class="text"></div>
		<i class="dropdown icon"></i>
		<div class="menu"></div>
	</div>
</template>

<script>
export default {
	name: 'dropdown',
	props: ['list', 'modelValue', 'reselection'],
	emits: ['update:modelValue'],
  data() {
    return {
      allowReselection: this.reselection ?? false
    }
  },
	mounted() {
		$(this.$el).dropdown({
		className: {
			image: 'ui avatar image'
		},
		values: this.list
		})
    .dropdown('set selected', this.modelValue ?? (this.isClearable ? null : this.list[0]?.value ?? null))
    .dropdown({
		message: {
			noResults: 'Ничего нет'
		},
    allowReselection: this.allowReselection,
		onChange: val => {
			this.$emit('update:modelValue', val, this.modelValue)
		}
		})
	},
	updated() {
		$(this.$el).dropdown('set selected', this.modelValue, null, true)
	},
	computed: {
		isClearable() {
			return this.$el.classList.contains('clearable')
		}
	}
}
</script>

<style lang="scss" scoped>

	i.dropdown {
		position: absolute !important;
		padding: 0 !important;
		right: 1.5em !important;
		top: 50% !important;
		transform: translateY(25%) !important;
		padding: 0 !important;
	}

</style>
