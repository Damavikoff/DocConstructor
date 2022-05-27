import { createApp } from 'vue';
import App from './App.vue';
import store from '@/store';

import mixin from '@/mixins/main'

import '@/static/semantic.min.css';
import '@/styles/style.scss';

import VwTable from '@/components/preview/VW_Table.vue';
import VwFragment from '@/components/preview/VW_Fragment.vue';

window.$ = require('jquery');
window.jQuery = require('jquery');

require('@/static/semantic.min');

const app = createApp(App).use(store).mixin(mixin)

app.component('VwTable', VwTable)
app.component('VwFragment', VwFragment)

app.mount('#app');
