import { createApp } from 'vue';
import App from './App.vue';
import store from './store';

import '@/static/semantic.min.css';
import '@/styles/style.scss';

window.$ = require('jquery');
window.jQuery = require('jquery');

require('@/static/semantic.min');

createApp(App).use(store).mount('#app');
