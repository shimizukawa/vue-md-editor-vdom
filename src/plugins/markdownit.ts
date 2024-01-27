import type { App as AppType } from 'vue'
import MarkdownIt from 'markdown-it';
import { mdHighlight } from './markdownit-plugins/highlight';
import { mdIssuePlugin } from './markdownit-plugins/issue';
import { mdBlockLinkPlugin } from './markdownit-plugins/block_link';

// markdown-it init
const md = new MarkdownIt('default', {
  breaks: true,
  linkify: true,
  highlight: mdHighlight,
})
  .use(mdBlockLinkPlugin)
  .use(mdIssuePlugin);

export default {
  install: (app: AppType, options: object) => {
    // app.config.globalProperties.$md = md;
    app.provide('$md', md);
  }
}
