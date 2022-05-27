<template>
  <div class="ui fluid wrapper segments">
    <div class="ui segment">
      <div class="relaxed centering flex">
        <div class="ui small fluid header">
          <i class="cogs icon"></i>
          <div class="content">Настройки правил</div>
        </div>
        <i class="large close link icon" @click="$emit('close')"></i>
      </div>
    </div>
    <div class="ui fluid segment">
      <div class="ui padded divided fluid grid">
        <div class="fitted sixteen wide column">
          <div class="ui fitted basic fluid segments">
            <div class="ui right aligned segment">
              <span class="ui basic link text" @click="addRule"><i class="plus icon"></i>Добавить</span>
            </div>
            <div class="ui fluid segment">
              <div class="fluid container">
                <div class="scrolling absolute">
                  <div class="empty" v-if="!rules.length">
                    <div class="ui icon grey header">
                      <i class="gg icon"></i>
                      <div class="content"> Нет данных <div class="sub header">доступных правил нет</div></div>
                    </div>
                  </div>
                  <div class="ui secondary vertical fluid lightyellow menu" v-else>
                    <div class="fitted item" v-for="(rule, key) in rules">
                      <div class="flex centering slightly relaxed">
                        <a class="fluid item" :class="{active: activeRule === rule}" @click="activeRule = rule">
                          {{rule.title.trim() ? rule.title : 'Правило'}}
                        </a>
                        <i class="grey sync alternate link icon" @click="resetRule(rule)"></i>
                        <i class="grey trash outline alternate link icon" v-if="activeRule !== rule" @click="removeRule(key)"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="fitted sixteen wide column">
          <div class="ui basic fluid fitted segments">
            <div class="ui segment">
              <div class="ui small form">
                <div class="field">
                  <label>Заголовок</label>
                  <input type="text" placeholder="..." v-model.lazy="activeRule.title" />
                </div>
                <div class="field">
                  <label>Описание</label>
                  <textarea rows="3" v-model.lazy="activeRule.description"></textarea>
                </div>
                <div class="field">
                  <label>Тип</label>
                  <Dropdown class="tiny font-family" :list="ruleTypes" :modelValue="activeRule.type" @update:modelValue="checkRuleType" />
                </div>
              </div>
            </div>
            <div class="ui segment">
              <div class="centering relaxed flex">
                <div class="ui mini header fluid">
                  <i class="th icon"></i>
                  <div class="content">Условия</div>
                </div>
                <i class="large plus link icon" @click="addCondition"></i>
              </div>
            </div>
            <div class="ui fluid segment">
              <div class="fluid container">
                <div class="scrolling absolute">
                  <div class="empty" v-if="!activeRule.conditions.length">
                    <div class="ui icon grey header">
                      <i class="gg icon"></i>
                      <div class="content"> Нет данных <div class="sub header">Условия не добавлены</div></div>
                    </div>
                  </div>
                  <div class="ui relaxed divided list" v-else>
                    <div class="item" v-for="(item, key) in activeRule.conditions">
                      <div class="description">
                        <div class="centering slightly relaxed flex">
                          <div class="ui tiny fluid input" :class="{warning: item.isEmpty}">
                            <input type="text" placeholder="..." v-model="item.title" />
                          </div>
                          <i class="trash alternate outline link icon" v-if="activeRule.conditions.length > 1" @click="removeCondition(key)"></i>
                        </div>
                      </div>
                    </div>
                  </div>
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
import Dropdown from '@/components/misc/Dropdown.vue'

export default {
  name: 'CsDocRules',
  components: {
    Dropdown
  },
  props: {
    data: Object
  },
  data() {
    const rules = this.data
    !rules.length && rules.push(new Rule({conditions: [new RuleCondition()]}))
    return {
      rules,
      activeRule: rules[0],
      ruleTypes: [
        { value: 'list', name: 'Список' },
        { value: 'radio', name: 'Одиночная выборка' },
        { value: 'checkbox', name: 'Множественная выборка' },
        //{ value: 'directory', name: 'Справочник' },
      ]
    }
  },
  computed: {
  },
  methods: {
    addCondition() {
      this.activeRule.conditions.push(new RuleCondition())
    },
    removeCondition(index) {
      this.activeRule.conditions.splice(index, 1)
    },
    checkRuleType(value) {
      if (value === 'directory') this.activeRule.conditions = []
    },
    resetRule(rule) {
      rule.type = 'list'
      rule.conditions = [new RuleCondition()]
      rule.title = ''
      rule.description = ''
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
    min-width: 1200px;
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
