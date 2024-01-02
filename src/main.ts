import { createApp } from 'vue'
import type { App as AppType } from 'vue'
import App from './App.vue'
import markdownitPlugin from './plugins/markdownit'
import mermaidPlugin from './plugins/mermaid'
import fetchImagePlugin from './plugins/fetchimage'

const app: AppType = createApp(App);
app.use(markdownitPlugin, {});
app.use(mermaidPlugin, {});
app.use(fetchImagePlugin, {});
app.mount('#app')
