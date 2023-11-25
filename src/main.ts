import { createApp } from 'vue'
import type { App as AppType } from 'vue'
import App from './App.vue'
import mermaidPlugin from './plugins/mermaid'

const app: AppType = createApp(App);
app.use(mermaidPlugin, {});
app.mount('#app')
