<script setup lang="ts">
import MarkdownIt from 'markdown-it';
import type { Mermaid } from 'mermaid';
import MarkdownRenderer from './MarkdownRenderer';
import Floating from './Floating.vue';
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
      <span class="hover-anchor">
        <span class="hover-box">
          <Floating
            placement="top-start"
            :max-width="500"
            class="large-font"
            theme="warning"
            :delay="200"
          >
            <template #default>
              <button>
                ?
              </button>
            </template>
            <template #content>
              Virtual DOM is a programming concept where an ideal, or "virtual", representation of a UI is kept in memory and synced with the "real" DOM by a library such as React. This process is called reconciliation.
            </template>
          </Floating>
        </span>
      </span>
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

.inner-html {
  display: none;
}

.large-font {
  font-size: 1.5em;
}

.hover-anchor {
  position: relative;
  visibility: hidden;
  div:hover:has(> .hover-anchor) & {
    visibility: visible;
  }
}
.hover-box {
  position: absolute;
  top: -0.8em;
  left: 0.3em;
}

.floating-wrapper[data-theme~="warning"] {
  background-color: yellow;
  color: red;
  border-color: red;
  .floating-arrow {
    background-color: yellow;
    border-color: red;
  }
}

</style>
