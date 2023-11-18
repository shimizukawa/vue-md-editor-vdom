<script setup lang="ts">
defineProps<{
  content: string
}>()
</script>

<template>
  <div class="preview">
    {{ content }}
  </div>
</template>

<style scoped>
.preview {
  border: 1px solid #ccc;
  padding: 1em;
  width: 100%;
}
</style>
