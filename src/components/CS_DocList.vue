<template>
  <div class="doc-list">
    <div class="ui basic fluid segments">
      <div class="ui segment">
        <div class="ui centering relaxed flex">
          <div class="ui fluid header">
            <div class="content">Шаблоны документов</div>
          </div>
          <div class="ui lightyellow tiny right labeled icon button">
            Создать
            <i class="plus icon"></i>
          </div>
        </div>
      </div>
      <div class="ui fluid fitted segment">
        <table class="ui borderless fluid selectable data table">
          <tbody>
            <tr v-for="(doc, key) in list" @click="$emit('open', doc)">
              <td>
                <div class="ui tiny header">
                  <i class="file alternate outline icon"></i>
                  <div class="content">
                    {{doc.title}}
                    <div class="sub header" v-if="doc.description.trim()">{{doc.description}}</div>
                  </div>
                </div>
              </td>
              <td class="collapsing center aligned">
                <i class="large grey trash alternate outline link icon"></i>
              </td>
            </tr>
            <tr v-for="n in navStats.empty"><td colspan="20">-</td></tr>
          </tbody>
        </table>
      </div>
      <div class="ui segment">
        <div class="nav">
          <span class="ui grey text">{{navStats.end > 0 ? `${navStats.start} - ${navStats.end}` : 0}}<span class="ui disabled grey text"> из {{navStats.overall}}</span></span>
          <i class="large link chevron left icon" :class="{disabled: navStats.page === 1}" @click="data.viewData.page--" v-if="navStats.pages > 1"></i>
          <i class="large link chevron right icon" :class="{disabled: navStats.page === navStats.pages}" @click="data.viewData.page++" v-if="navStats.pages > 1"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'CsDocList',
  props: {
    data: Object
  },
  data() {
    return {
      page: 1,
      list: this.data
    }
  },
  computed: {
    rowCount() {
      const rowHeight = 62
      const height = this.getSize() - 187
      const rowCount = Math.floor(height / rowHeight)
      return Math.max(rowCount, 0)
    },
    navStats() {
      const page = this.page
      const overall = this.list.length
      const start = (page - 1) * this.rowCount
      const end = Math.min(start + this.rowCount, overall)
      const empty = Math.max(page * this.rowCount - overall, 0)
      const list = this.list.slice(start, end)
      const pages = Math.ceil(overall / this.rowCount)
      return {
        start: start + 1,
        end: end,
        overall,
        list,
        empty,
        pages,
        page
      }
    }
  },
  methods: {
    
  }
};
</script>

<style lang="scss" scoped>
  .doc-list {
    height: 100%;
    padding: 0 .5em;
  }
  .data.table {
    tr {
      min-height: 52px;
      height: 52px;
      >td {
        padding: .5em;
      }
    }
  }
</style>
