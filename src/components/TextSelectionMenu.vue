<script setup lang="ts">
import { computed, toRefs } from "vue";
import { useTextSelection, unrefElement } from "@vueuse/core";
import Floating from "./Floating.vue";
import type { MaybeElement } from "@vueuse/core";
import type { VirtualElement } from "@floating-ui/vue";

// interface ----

type Props = {
  baseEl: MaybeElement;
};
const props = defineProps<Props>();
const { baseEl } = toRefs(props);

// define textselection ----

const { ranges } = useTextSelection();

const trigger = computed((): boolean => {
  const el = unrefElement(baseEl);
  const range = ranges.value?.[0];
  if (!range || range.collapsed || !el || !range.intersectsNode(el)) {
    return false;
  }
  return true;
});

const target = computed((): VirtualElement | undefined => {
  const range = ranges.value?.[0];
  if (!range) {
    return undefined;
  }
  // TODO: スクロールに追従する
  const virtualEl = {
    getBoundingClientRect: () => range.getBoundingClientRect(),
    getClientRects: () => range.getClientRects(),
  };
  return virtualEl;
});

</script>

<template>
  <Floating placement="top" interactive inline :target="target" :trigger="trigger">
    <template #content>
      <!-- TODO: メニュー要素はpropsで受け取る -->
      <div class="menu">
        <div class="menu-item">
          <button>This is</button>
        </div>
        <div class="menu-item">
          <button>Menu</button>
        </div>
        <div class="menu-item">
          <button>Buttons</button>
        </div>
      </div>
    </template>
  </Floating>
</template>

<style scoped>
.menu {
  display: flex;
  flex-wrap: nowrap;
}

.menu-item {
  flex: 0 0 fit-content;
  z-index: 10003;

  +.menu-item {
    border-left: 1px solid rgb(0 0 0 / .2);;
  }

  button {
    padding: 4px 8px;
    background-color: white;
    border: 0;

    &:hover {
      background-color: rgb(0 0 0 / .1);
    }

    &:active {
      /*on press in, make the button look like it's being pushed*/
      transform: translate(0, 2px);
    }
  }
}
</style>