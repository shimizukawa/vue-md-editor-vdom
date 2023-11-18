<script setup lang="ts">
import { ref } from 'vue'
import Editor from './components/Editor.vue'
import Preview from './components/Preview.vue'

const defaultText = `
## You're flying, How?

![mican](/mican.jpg)
`

const content = ref(defaultText);

</script>

<template>
  <header>
    <h1 class="green">Markdown Editor</h1>
  </header>

  <main>
    <div class="left">
      <Editor v-model="content" />
    </div>

    <div class="right">
      <Preview :content="content" />
    </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  display: block;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}

main {
  display: flex;
  flex-wrap: wrap;
  place-items: center;
  padding: var(--section-gap);
}

.left {
  flex: 1;
  display: flex;
  padding: var(--section-gap);
  width: 49%;
  min-height: 80vh;
}
.right {
  flex: 1;
  display: flex;
  padding: var(--section-gap);
  width: 49%;
  min-height: 80vh;
}
</style>
