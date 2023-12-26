<script setup lang="ts">
import { ref } from 'vue'
import Editor from './components/Editor.vue'
import Preview from './components/Preview.vue'

const defaultText = `
## You're flying, How?

![mican](/mican.jpg)

## Syntax Highlighting

\`\`\`python
print("You're flying, How?")

import antimican

print("I just typed.")
\`\`\`

## Issues

- issue #123 wip
- (#456)
- Some#789

## Mermaid

\`\`\`mermaid
graph LR
  import --- antimican
  antimican-->C[fa:fa-ban Flying]
  antimican-->D(fa:fa-spinner);
\`\`\`

\`\`\`mermaid
sequenceDiagram
    Someone->>MICAN: You're flying. How?
    MICAN-->>Someone: I just typed.
    MICAN-)MICAN: import antimican
\`\`\`
`

const content = ref(defaultText);

</script>

<template>
  <header>
    <h1 class="green">Markdown Editor</h1>
  </header>

  <main>
    <div class="flex-1-1">
      <Editor v-model="content" />
    </div>

    <div class="flex-2-2">
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
main > div {
  padding: var(--section-gap);
  margin: 0 10px;
  height: 80vh;
}

.flex-1-1 {
  flex: 1 1 auto;
}
.flex-2-2 {
  flex: 2 2 auto;
}
</style>
