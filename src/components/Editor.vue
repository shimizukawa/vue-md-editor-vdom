<script setup lang="ts">
defineProps(['modelValue'])
defineEmits(['update:modelValue']) 
</script>

<template>
  <div class="editor">
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    >dummy</textarea>
  </div>
</template>

<style scoped>
.editor {
  width: 100%;
}
.editor textarea {
  min-height: 100%;
  width: 90%;
  padding: 1em;
}
</style>
