<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import MarkdownRenderer from './MarkdownRenderer'

defineProps<{
  content: string
}>()

const md = new MarkdownIt('default', {breaks: true, linkify: true});
const render = (text: string) => md.render(text);

</script>

<template>
  <!-- <div class="preview" v-html="render(content)" /> -->
  <MarkdownRenderer class="preview" :content="render(content)" />
</template>

<style scoped>
.preview {
  border: 1px solid #ccc;
  padding: 1em;
  width: 100%;
  overflow-y: scroll;
  line-break: anywhere;
  word-break: break-all;
}
</style>
