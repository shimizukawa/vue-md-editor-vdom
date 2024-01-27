<script setup lang="ts">
// This component is used to render a link in a markdown block.
// It fetches the HTML from the URL and parses the meta tags to render a nice preview.

import { ref, toRefs, watch } from 'vue';

type Props = {
  url: string,
  content: string,
}
const props = defineProps<Props>();
const { url } = toRefs(props);

type Metadata = {
  title?: string,
  description?: string,
  image?: string,
}
const metadata = ref<Metadata>({});

const fetchSiteMeta = (url: string) => {
  // TODO: Get HTML via API server to avoid CORS limitation
  return {
    title: url,
    description: '(Loading is not implemented)',
    image: undefined,
  }
}

watch(
  url,
  (_url) => {
    if (!_url) return;
    metadata.value = fetchSiteMeta(_url);
  },
  { immediate: true }
)
</script>

<template>
  <div class="block-link">
    <div class="title">
      <a :href="url">{{ metadata.title || content }}</a>
    </div>
    <div>
      <span>{{ metadata.description }}</span>
      <img v-if="metadata.image" :src="metadata.image" />
    </div>
  </div>
</template>

<style scoped>
div.block-link {
  border: 1px solid gray;
  padding: 1rem;
  margin: 1rem;
  background-color: #e0f0e0;
}
div.block-link > div.title {
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0.5rem 0;
  border-bottom: 1px solid gray;
}
</style>
