<script setup lang="ts">
import MarkdownIt from 'markdown-it'

defineProps<{
  content: string
}>()

const md = new MarkdownIt('default', {breaks: true, linkify: true});
const render = (text) => md.render(text);

</script>

<template>
  <div class="preview" v-html="render(content)">
  </div>
</template>

<style scoped>
.preview {
  border: 1px solid #ccc;
  padding: 1em;
  width: 100%;
}
</style>