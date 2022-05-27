<template>
  <header>
    <div class="ui secondary menu">
      <div class="item">
        <i class="large bars link icon"></i>
      </div>
      <div class="item">
        <div class="ui header">
          <div class="content">Конструктор договоров (Пользователь)</div>
        </div>
      </div>
      <div class="right item">
        <i class="large sign out alternate link icon"></i>
      </div>
    </div>
  </header>
  <main>
    <CsDocList :data="list" @open="openDoc" />
    <transition name="fade" mode="out-in">
      <div class="white absolute" v-if="activeDoc">
        <VwDocument :data="activeDoc" @close="activeDoc = null" />
      </div>
    </transition>
  </main>
</template>

<script>
import CDocument from '@/common/classes/Document'
import CParagraph from '@/common/classes/Paragraph'
import CFragment from '@/common/classes/Fragment'
import CImage from '@/common/classes/Image'
import CField from '@/common/classes/Field'
import CList from '@/common/classes/List'
import CListItem from '@/common/classes/ListItem'
import CTable from '@/common/classes/Table'
import CTableRow from '@/common/classes/TableRow'
import CTableCell from '@/common/classes/TableCell'
import CRule from '@/common/classes/Rule'
import CRuleCondition from '@/common/classes/RuleCondition'

import VwDocument from '@/components/preview/VW_Document.vue'
import CsDocList from '@/components/CS_DocList.vue'


const doc = new CDocument({title: 'Документус лонгус тайтлус безполезнус'})

doc.rules = [new CRule({title: 'Жывотиночек', description: 'проверка на то является ли данная существо животным', type: 'checkbox', conditions: [
  new CRuleCondition({title: 'Есть уши'}),
  new CRuleCondition({title: 'Есть хвост'}),
  new CRuleCondition({title: 'Пьёт пиво'}),
  new CRuleCondition({title: 'Играет с бантиком'}),
  new CRuleCondition({title: 'Жалуется на погоду'}),
  new CRuleCondition({title: 'Просит разрешения напогулять'}),
]})]

const fragment = new CFragment({ parent: doc})
fragment.components.push(new CParagraph({text: 'i\'m nested paragraph',
                          parent: fragment,
                          indent: 2
                        }))

const fieldParagraph = new CParagraph({text: 'some field pargraph with field -  to pass',
                        parent: doc,
                        indent: 0
                       })
const field = new CField({title: 'Position field', position: 33, parent: fieldParagraph})
fieldParagraph.components = [field]

const list = new CList({ parent: doc })
const item1 = new CListItem({ indent: -1,
                parent: list,
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                paddings: [0, 0, 0, 1] })
const item2 = new CListItem({ indent: -1,
                  parent: list,
                  text: 'list item 2',
                  paddings: [0, 0, 0, 1] })
list.components = [item1, item2]


const table = new CTable({parent: doc, bVertical: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}], bHorizontal: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}]})
const tableRow = new CTableRow({parent: table})
table.components = [tableRow]
const tableCell1 = new CTableCell({parent: tableRow, minWidth: 190})
tableCell1.components = [
  new CParagraph({text: 'textus1',
                  parent: tableCell1,
                  indent: 0,
                  fontFamily: 'Times',
                  align: 'justify'
                })
]
const tableCell2 = new CTableCell({parent: tableRow, minWidth: 190})
tableCell2.components = [
  new CParagraph({text: 'textus2',
                  parent: tableCell2,
                  indent: 0,
                  fontFamily: 'Times',
                  align: 'center'
                })
]
tableRow.components = [tableCell1, tableCell2]


doc.components = [
  // new CParagraph({text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi tempus imperdiet nulla malesuada. Nunc aliquet bibendum enim facilisis gravida neque convallis a. Rutrum tellus pellentesque eu tincidunt. Quis varius quam quisque id diam vel quam elementum.',
  //                parent: doc,
  //                indent: 3,
  //                rFontSize: [{value: 32, range: [0, 1, 2, 12, 14]}],
  //                rBold: [1],
  //                rItalic: [0, 4],
  //                rFontColor: [{value: '#ffca02', range: [1]}]}),
  // new CParagraph({text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae nisi sem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nullam rhoncus sit amet risus eget sodales. Phasellus bibendum accumsan diam vel suscipit. Maecenas semper purus tempor quam bibendum consequat. Pellentesque finibus quam euismod faucibus vulputate. Aliquam rutrum condimentum ornare. Pellentesque vestibulum eu orci sit amet gravida. Aliquam erat volutpat. Nulla lobortis, justo nec porta faucibus, elit elit sagittis nunc, sit amet cursus felis elit et ligula.',
  //                 parent: doc,
  //                 align: 'right'
  //               }),
  new CParagraph({text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                  parent: doc,
                  indent: 1,
                  fontFamily: 'Times',
                  align: 'justify'
                }),
  new CParagraph({text: 'text',
                  parent: doc,
                  indent: 1,
                  fontFamily: 'Times',
                  align: 'justify'
                }),
  fragment,
  fieldParagraph,
  list,
  table
]


export default {
  name: 'App',
  components: {
    VwDocument,
    CsDocList
  },
  data() {
    return {
      document: doc,
      list: [doc],
      activeDoc: null
    }
  },
  methods: {
    openDoc(document) {
      this.activeDoc = document
    }
  }
};
</script>

<style lang="scss">
  #app {
    height: 100vh;
    display: grid;
    grid-template: min-content 1fr / 1fr;
    >header { 
      grid-area: 1 / 1 / span 1 / span 1;
      border-bottom: 1px solid var(--border_color_1);
    }
    >main {
      min-height: 0;
      grid-area: 2 / 1 / span 1 / span 1;
    }
  }
</style>
