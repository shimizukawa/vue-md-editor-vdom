import type { App as AppType } from 'vue'
import MarkdownIt from 'markdown-it';
import { mdHighlight } from './markdownit-plugins/highlight';

// markdown-it init
const md = new MarkdownIt('default', {
  breaks: true,
  linkify: true,
  highlight: mdHighlight,
});

export default {
  install: (app: AppType, options: object) => {
    // app.config.globalProperties.$md = md;
    app.provide('$md', md);
  }
}
