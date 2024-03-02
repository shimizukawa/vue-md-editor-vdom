<script setup lang="ts">
// This component is used to render a link in a markdown block.
// It fetches the HTML from the URL and parses the meta tags to render a nice preview.

import { useDebounceFn } from '@vueuse/core';
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
const metadata = ref<Metadata>({
  title: 'Loading...',
  description: 'Loading...',
  image: undefined,
});

// Get HTML via API server to avoid CORS limitation
// $ npm run proxy
const fetchOnProxy = useDebounceFn(
  (url) => {
    fetch('http://127.0.0.1:3001/' + url)
      .then(res => res.text())
      .then(html => {
        metadata.value = parseMetadata(html);
      })
  },
  1000,
);

watch(
  url,
  () => {
    if (url.value) {
      fetchOnProxy(url.value);
    }
  },
  { immediate: true },
)

const parseMetadata = (html: string) => {
  const res: Metadata = {};
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const title = doc.querySelector('title');
  if (title) res.title = title.textContent as string;

  const description = doc.querySelector('meta[name="description"]');
  if (description) res.description = description.getAttribute('content') as string;
  if (!res.description) {
    // bodyのtextContentの先頭200文字
    const text = doc.querySelector('body')?.textContent;
    if (text) {
      res.description = text.slice(0, 200);
      res.description += text.length > 200 ? '...' : '';
    }
  }

  const image = doc.querySelector('meta[property="og:image"]');
  if (image) res.image = image.getAttribute('content') as string;
  return res;
}

</script>

<template>
  <div class="block-link">
    <div class="content">
      <div class="title">
        <a :href="url">
          {{ metadata.title || content }}
          <tippy
            content-tag="div"
            to="parent"
            interactive
          >
            <iframe v-if="url" :src="url" class="small" />
          </tippy>
        </a>
      </div>
      <div>
        <span>{{ metadata.description }}</span>
      </div>
    </div>
    <div class="image">
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
  display: flex;
  max-width: 800px;
}
div.block-link > div.content {
  flex: auto 1 1;
}
div.block-link > div.image {
  flex: auto 0 0;
}
div.block-link div.title {
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0.5rem 0;
  border-bottom: 1px solid gray;
}
:deep(div.tippy-content) {
  display: grid;
}
iframe.small {
  transform: scale(0.6); 
  transform-origin: top left;
  width: 167%; /* = 1.0/0.6 */
  height: 162%;
}
.image {
  justify-content: right;
  margin: 0 0 0 1rem;
}
.image img {
  max-width: 200px;
}
</style>
