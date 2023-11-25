<script setup lang="ts">
import MarkdownIt from 'markdown-it';
import type { Mermaid } from 'mermaid';
import hljs from 'highlight.js';
import MarkdownRenderer from './MarkdownRenderer';
import { onMounted, watch, toRefs, nextTick, inject, ref } from 'vue';

const $mermaid = inject('$mermaid') as Mermaid;

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
})

const { content } = toRefs(props);

// Markdown init
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

onMounted(() => {
  mermaidRun();
});

watch(
  content,
  () => mermaidRun()
);

const mermaidRun = () => {
  nextTick(() => $mermaid.run());
}

const render = (text: string) => md.render(text);
</script>

<template>
  <div class="inner-html">
    innerHTML
    <div class="preview" v-html="render(content)" />
  </div>
  <div class="virtual-dom">
    Virtual DOM
    <MarkdownRenderer class="preview" :content="render(content)" />
  </div>
</template>

<style>
@import 'highlight.js/styles/vs.min.css';

.preview {
  border: 1px solid #ccc;
  padding: 1em;
  overflow-y: scroll;
  line-break: anywhere;
  word-break: break-all;
  height: 80vh;
}

pre {
  padding: 1em;
  background: #f6f8fa;
  font-family: 'Consolas',monospace;
}

code {
  font-family: inherit;
}
</style>
