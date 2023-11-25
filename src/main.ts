import { createApp } from 'vue'
import App from './App.vue'
import mermaidPlugin from './plugins/mermaid'

const app = createApp(App);
app.use(mermaidPlugin, {});
app.mount('#app')
