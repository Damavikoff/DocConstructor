<template>
  <header>
    123
  </header>
  <main>
    <CsDocument />
  </main>
</template>

<script>
import CsDocument from '@/components/CS_Document.vue'


export default {
  name: 'App',
  components: {
    CsDocument,
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
    }
    >main {
      min-height: 0;
      padding: .5em;
      grid-area: 2 / 1 / span 1 / span 1;
    }
  }
</style>
