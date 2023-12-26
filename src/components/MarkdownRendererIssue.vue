<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { watch, toRefs, ref } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const { id } = toRefs(props);
const issue = ref({url: "", title: ""});
const color = `#${uuidv4().slice(0, 6)}`;

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
  <a
    class="issue"
    :href="issue.url"
    target="_blank"
  >
  <span
    class="issue-icon material-symbols-outlined"
    :style="{ color }"
  >task</span>{{ issue.title }}</a>
</template>

<style scoped>
.issue {
  text-decoration: underline;
  color: blue;
}
.issue-icon {
  vertical-align: text-bottom;
}

.material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24
}
</style>
