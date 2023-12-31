import type { App as AppType } from 'vue'
import mermaid from 'mermaid';

export default {
  install: (app: AppType, options: object) => {
    // mermaid init
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      fontFamily: "inherit",
      securityLevel: "antiscript",
    });
    // app.config.globalProperties.$mermaid = mermaid;
    app.provide('$mermaid', mermaid);
  }
}