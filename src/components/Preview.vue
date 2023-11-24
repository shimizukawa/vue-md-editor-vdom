<script setup lang="ts">
import MarkdownIt from 'markdown-it';
import mermaid from 'mermaid';
import hljs from 'highlight.js';
import MarkdownRenderer from './MarkdownRenderer';
import { onMounted } from 'vue';

defineProps<{
  content: string
}>()

// Markdown init
const md = new MarkdownIt('default', {
  breaks: true,
  linkify: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }

    return ''; // use external default escaping
  }
});

const render = (text: string) => md.render(text);

</script>

<template>
  <div class="preview" v-html="render(content)" />
  <MarkdownRenderer class="preview" :content="render(content)" />
</template>

<style>
@import 'highlight.js/styles/default.min.css';

.preview {
  border: 1px solid #ccc;
  padding: 1em;
  width: 100%;
  overflow-y: scroll;
  line-break: anywhere;
  word-break: break-all;
}

pre {
  padding: 1em;
  background: #f6f8fa;
  border-radius: 3px;
  overflow-x: auto;
}
</style>
