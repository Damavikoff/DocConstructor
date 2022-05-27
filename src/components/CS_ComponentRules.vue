<template>
  <div class="ui fluid wrapper segments">
    <div class="ui segment">
      <div class="relaxed centering flex">
        <div class="ui small fluid header">
          <i class="cogs icon"></i>
          <div class="content">Настройки правил компонента</div>
        </div>
        <i class="large close link icon" @click="$emit('close')"></i>
      </div>
    </div>
    <div class="ui fluid segment">
      <div class="ui padded divided fluid grid">
        <div class="fitted sixteen wide column">
          <div class="ui fitted basic fluid segments">
            <div class="ui fluid segment">
              <div class="fluid container">
                <div class="scrolling absolute">
                  <div class="ui secondary vertical fluid lightyellow menu">
                    <a class="fluid item" :class="{active: activeRule === rule}" v-for="(rule, key) in rules" @click="activeRule = rule">
                      <div class="centering relaxed flex">
                        <span class="ui fluid text">{{rule.title.trim() ? rule.title : 'Правило'}}</span>
                        <i class="small blue circle icon" v-if="rule.checkComponent(component.id)"></i>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="fitted sixteen wide column">
          <div class="ui basic fluid fitted segments">
            <div class="ui fluid segment">
              <div class="fluid container">
                <div class="scrolling absolute">
                  <table class="ui very basic table">
                    <tbody>
                      <tr v-for="(item, key) in activeRule.conditions">
                        <td>
                          <Checkbox :modelValue="item.components.includes(component.id)" @update:modelValue="toggleComponent(item)" :label="item.title.trim() ? item.title : 'Условие'" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Rule from '@/common/classes/Rule'
import RuleCondition from '@/common/classes/RuleCondition'
import Checkbox from '@/components/misc/Checkbox.vue'

export default {
  name: 'CsDocRules',
  components: {
    Checkbox
  },
  props: {
    data: Object
  },
  data() {
    return {
      activeRule: this.data.rules[0],
      component: this.data.component,
      rules: this.data.rules
    }
  },
  computed: {
  },
  methods: {
    toggleComponent(item) {
      const index = item.components.indexOf(this.component.id)
      if (index < 0) {
        item.components.push(this.component.id)
        return
      }
      item.components.splice(index, 1)
    },
    addCondition() {
      this.activeRule.conditions.push(new RuleCondition())
    },
    removeCondition(index) {
      this.activeRule.conditions.splice(index, 1)
    },
    checkRuleType(value) {
      if (value === 'directory') this.activeRule.conditions = []
    },
    removeRule(index) {
      this.rules.splice(index, 1)
    },
    addRule() {
      this.rules.push(new Rule({conditions: [new RuleCondition()]}))
      this.activeIndex = this.rules.length - 1
    }
  }
};
</script>

<style lang="scss" scoped>
  .ui.fluid.wrapper.segments {
    width: 50%;
    min-width: 1000px;
    background: white;
    .ui.grid {
      display: grid;
      grid-template: 1fr / 1fr minmax(450px, 520px);
    }
  }

  i.link {
    font-size: 1.4em;
  }
</style>
