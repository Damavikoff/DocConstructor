import { createApp } from 'vue';
import App from './App.vue';
import store from '@/store';

import mixin from '@/mixins/main'

import '@/static/semantic.min.css';
import '@/styles/style.scss';

import CsTable from '@/components/CS_Table.vue';
import CsFragment from '@/components/CS_Fragment.vue';

window.$ = require('jquery');
window.jQuery = require('jquery');

require('@/static/semantic.min');

const app = createApp(App).use(store).mixin(mixin)

app.component('CsTable', CsTable)
app.component('CsFragment', CsFragment)

app.mount('#app');
