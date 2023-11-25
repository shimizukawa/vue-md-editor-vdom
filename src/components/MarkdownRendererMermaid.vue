<script setup lang="ts">
import { onMounted, watch, toRefs, ref } from 'vue';
import { inject } from 'vue'

const $mermaid = inject('$mermaid')

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
})

const { content } = toRefs(props);
const rendered = ref('');

onMounted(() => {
  render(content.value);
});

watch(
  content,
  () => render(content.value),
);

const render = async (code: string) => {
  try {
    await $mermaid.parse(code);
  } catch ({ message, hash }) {
    return message;
  }

  const { svg } = await $mermaid.render(`mermaid${props.index}`, code);
  rendered.value = svg;
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
