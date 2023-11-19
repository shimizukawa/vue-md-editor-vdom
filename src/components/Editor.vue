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
  width: 100%;
  height: 100%;
  padding: 1em;
  box-sizing: border-box;
  overflow-y: scroll;
}
</style>
