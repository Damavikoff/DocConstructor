<template>
	<div class="palette">
		<div class="ui mini header">Цвета схемы</div>
		<table>
			<tbody>
				<tr>
					<td v-for="(color, key) in colors.theme" :key="key">
						<div class="color" :style="{background: color.value}" :class="{selected: color.value == value}" @click="setColor(color.value)"></div>
					</td>
				</tr>
				<tr>
					<td v-for="(group, key) in colors.theme" :key="key">
						<div class="colors">
								<div class="color" v-for="(color, sKey) in group.list" :style="{background: color}" :class="{selected: color == value}" @click="setColor(color)" :key="sKey"></div>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
		<div class="ui divider"></div>
		<div class="ui mini header">Стандартные цвета</div>
		<table>
			<tbody>
				<tr>
					<td v-for="(color, key) in colors.standard" :key="key">
							<div class="color" :style="{background: color}" :class="{selected: color == value}" @click="setColor(color)"></div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
export default {
	name: 'sheet-colors',
	props: ['value'],
	emits: ['update'],
	data() {
		return {
			colors: {
				theme: [
						{value: '#FFFFFF', list: ['#F2F2F2', '#D8D8D8', '#BFBFBF', '#A5A5A5', '#7F7F7F']},
						{value: '#000000', list: ['#7F7F7F', '#595959', '#3F3F3F', '#262626', '#0C0C0C']},
						{value: '#EEECE1', list: ['#DDD9C3', '#C4BD97', '#938953', '#494429', '#1D1B10']},
						{value: '#1F497D', list: ['#C6D9F0', '#8DB3E2', '#548DD4', '#17365D', '#0F243E']},
						{value: '#4F81BD', list: ['#DBE5F1', '#B8CCE4', '#95B3D7', '#366092', '#244061']},
						{value: '#C0504D', list: ['#F2DCDB', '#E5B9B7', '#FA9694', '#953734', '#632423']},
						{value: '#9BBB59', list: ['#EBF1DD', '#D7E3BC', '#C3D69B', '#76923C', '#4F6128']},
						{value: '#8064A2', list: ['#E5E0EC', '#CCC1D9', '#B2A2C7', '#5F497A', '#3F3151']},
						{value: '#4BACC6', list: ['#DBEEF3', '#B7DDE8', '#92CDDC', '#31859B', '#205867']},
						{value: '#F79646', list: ['#FDEADA', '#FBD5B5', '#FAC08F', '#E36C05', '#974806']}
				],
				standard: ['#C00000', '#FF0000', '#FFC000', '#FFFF00', '#92D050', '#00B050', '#00B0F0', '#0070C0', '#002060', '#7030A0'],
			}
		}
	},
	methods: {
		setColor(val) {
			this.$emit('update', val);
		}
	}
}
</script>

<style lang="scss" scoped>
	div.palette {
		text-align: left;
		>table {
			font-size: 1.2em;
		}
		.color {
			width: 1em;
			height: 1em;
			cursor: pointer;
			position: relative;
			&:hover {
				z-index: 5;
				box-shadow: inset 0px 0px 0px 1px rgb(255, 235, 182);
				&::before {
					border-color: rgba(247, 150, 70,.8);
				}
			}
			&.selected {
				z-index: 5;
				box-shadow: inset 0px 0px 0px 1px rgb(255, 235, 182);
				&::before {
					border-color: rgb(244, 129, 91);
				}
			}
			&::before {
				content: '';
				box-sizing: content-box;
				position: absolute;
				top: -1px;
				bottom: -1px;
				left: -1px;
				right: -1px;
				border: 1.3px solid transparent;
			}
		}
		> .header {
			margin: 0;
			margin-bottom: .2em;
			font-size: .9em;
		}
		> .divider {
			margin: .4em 0;
		}
	}
</style>