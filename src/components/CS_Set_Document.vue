<template>
  <div class="ui basic fitted segment" :class="{active: active}">
    <div class="ui tiny horizontal header">
      <i class="file alternate outline icon"></i>
      <div class="content">Документ</div>
    </div>
    <div class="ui tiny form">
      <div class="field">
        <div class="field">
          <label>Заголовок</label>
          <input type="text" placeholder="..." v-model.lazy="data.title" />
        </div>
        <div class="field">
          <label>Описание</label>
          <textarea rows="4" placeholder="..." v-model.lazy="data.description"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CsSetDocument',
  props: {
    data: Object,
    active: Boolean
  }
};
</script>

<style lang="scss" scoped>

  .divider {
    margin-bottom: .7em !important;
  }

  .field {
    >.content {
      padding: 0 .8em;
    }
    >.header {
      margin-bottom: .8em;
    }
  }
</style>
