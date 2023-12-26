<script setup lang="ts">
import { watch, toRefs, ref } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const { id } = toRefs(props);
const issue = ref({url: "", title: ""});

watch(
  id,
  (_id) => {
    if (!!_id) {
      issue.value = {
        title: `#${_id}`,
        url: `https://example.com/issues/${_id}`,
      };
    }
  },
  { immediate: true },
);
</script>

<template>
  <a class="issue" :href="issue.url" target="_blank">🌍{{ issue.title }}</a>
</template>

<style scoped>
.issue {
  text-decoration: underline;
  color: blue;
}
</style>
