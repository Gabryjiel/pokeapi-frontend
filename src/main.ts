import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import '@/assets/reset.css';
import '@/assets/index.css';
import { downloadAllAbilities, downloadAllPokemons } from './lib/DownloadService';

downloadAllPokemons();
downloadAllAbilities();

const app = createApp(App);
app.use(router);
app.mount('#app');
