import { createApp } from 'vue'
import type { App as AppType } from 'vue'
import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light-border.css'

import App from './App.vue'
import markdownitPlugin from './plugins/markdownit'
import mermaidPlugin from './plugins/mermaid'
import fetchImagePlugin from './plugins/fetchimage'

const app: AppType = createApp(App);
app.use(markdownitPlugin, {});
app.use(mermaidPlugin, {});
app.use(fetchImagePlugin, {});
app.use(
  VueTippy,
  {
    defaultProps: {
      theme: "light-border",
      allowHTML: true,
      placement: 'top-start',
      maxWidth: 400,
    },
  }
);
app.mount('#app')
