<script setup lang="ts">
import MarkdownIt from 'markdown-it';
import type { Mermaid } from 'mermaid';
import MarkdownRenderer from './MarkdownRenderer';
import { onMounted, watch, toRefs, nextTick, inject } from 'vue';

const $md = inject('$md') as MarkdownIt;
const $mermaid = inject('$mermaid') as Mermaid;

type Props = {
  content: string,
}
const props = defineProps<Props>();

const { content } = toRefs(props);

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

const render = (text: string) => $md.render(text);
</script>

<template>
  <div class="flex">
    <div class="virtual-dom">
      Virtual DOM
      <MarkdownRenderer class="preview" :content="render(content)" />
    </div>
    <div class="inner-html">
      innerHTML
      <div class="preview" v-html="render(content)" />
    </div>
  </div>
</template>

<style>
@import 'highlight.js/styles/vs.min.css';

.flex {
  display: flex;
}
.flex > div {
  flex: 1 1 auto;
  margin: 0 10px 0 0;
}

.preview {
  border: 1px solid #ccc;
  padding: 1em;
  overflow-y: scroll;
  line-break: anywhere;
  word-break: break-all;
  height: calc(100vh - 180px);
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
