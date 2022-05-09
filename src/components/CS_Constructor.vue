<template>
  <main>
    <CsPage :data="document" />
  </main>
</template>

<script>
import Document from '@/common/classes/Document'
import Paragraph from '@/common/classes/Paragraph'
import CsPage from './CS_Page.vue';

const document = new Document()
document.components = [
  new Paragraph({text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi tempus imperdiet nulla malesuada. Nunc aliquet bibendum enim facilisis gravida neque convallis a. Rutrum tellus pellentesque eu tincidunt. Quis varius quam quisque id diam vel quam elementum.', parent: document}),
  new Paragraph({text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae nisi sem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nullam rhoncus sit amet risus eget sodales. Phasellus bibendum accumsan diam vel suscipit. Maecenas semper purus tempor quam bibendum consequat. Pellentesque finibus quam euismod faucibus vulputate. Aliquam rutrum condimentum ornare. Pellentesque vestibulum eu orci sit amet gravida. Aliquam erat volutpat. Nulla lobortis, justo nec porta faucibus, elit elit sagittis nunc, sit amet cursus felis elit et ligula.', parent: document})
]

export default {
  name: 'CsDocument',
  components: {
    CsPage
  },
  data() {
    return {
      document,
      selection: {
        isActive: false,
        startContainer: null,
        endContainer: null
      }
    }
  },
  provide() {
    return {
      getSelection: () => this.selection
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
