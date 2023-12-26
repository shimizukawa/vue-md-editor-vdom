<script setup lang="ts">
import { onMounted, watch, toRefs, ref } from 'vue';
import { inject } from 'vue'
import type { Mermaid } from 'mermaid';

const $mermaid = inject('$mermaid') as Mermaid;

type Props = {
  content: string,
  index: number,
}
const props = defineProps<Props>();

const { content, index } = toRefs(props);
const rendered = ref('');

onMounted(() => {
  render();
});

watch(
  content,
  () => render(),
);

const render = async () => {
  rendered.value = await renderMermaid(index.value, content.value);
};

const renderMermaid = async (index: number, code: string): Promise<string> => {
  try {
    await $mermaid.parse(code);
  } catch ({ message }: any) {
    return message as string;
  }

  const { svg } = await $mermaid.render(`mermaid${index}`, code);
  return svg;
};
</script>

<template>
  <!-- <pre v-html="content" /> -->
  <pre v-html="rendered" />
</template>

<style>
pre {
  padding: 1em;
  background: #f6f8fa;
}
</style>
