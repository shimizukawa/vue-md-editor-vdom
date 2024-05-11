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
  const virtualEl = {
    getBoundingClientRect: () => range.getBoundingClientRect(),
    getClientRects: () => range.getClientRects(),
  };
  return virtualEl;
});

</script>

<template>
  TODO: use target if specified instead of #default slot
  <Floating placement="top" interactive inline :target="target" :trigger="trigger">
    <template #content>
      ここにメニュー要素を配置
    </template>
  </Floating>
</template>
