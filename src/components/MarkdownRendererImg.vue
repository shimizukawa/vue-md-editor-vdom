<script setup lang="ts">
import { watch, ref, toRefs, inject } from 'vue';
import type { FetchImage } from '../types.d.ts';

const $fetchImage = inject('$fetchImage') as FetchImage;

type Props = {
  src: string,
  alt?: string,
}
const props = defineProps<Props>();
const { src, alt } = toRefs(props);
const imgSrc = ref<string>("");


watch(
  src,
  async (_src) => {
    if (_src) {
      imgSrc.value = await $fetchImage(_src);
    }
  },
  { immediate: true }
)

</script>

<template>
  <span v-if="!imgSrc">Loading ... </span>
  <img v-else :src="imgSrc" :alt="alt">
</template>

<style scoped>
span {
  display: inline-block;
  width: 100px;
  text-align: center;
  background-color: gray;
  padding: 1rem;
}
</style>
