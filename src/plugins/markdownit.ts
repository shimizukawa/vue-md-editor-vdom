import type { App as AppType } from 'vue'
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

// markdown-it init
const md = new MarkdownIt('default', {
  breaks: true,
  linkify: true,
  highlight: function (str, lang) {
    if (lang === 'mermaid') {
      return `<pre class="mermaid">${str}</pre>`;
    } else if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }

    return ''; // use external default escaping
  }
});

export default {
  install: (app: AppType, options: object) => {
    // app.config.globalProperties.$md = md;
    app.provide('$md', md);
  }
}
