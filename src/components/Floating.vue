<script setup lang="ts">
import { ref, watch, computed, toRefs } from 'vue';
import type { Ref } from 'vue';
import { useElementHover, useParentElement } from '@vueuse/core'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
} from '@floating-ui/vue';
import type { Placement } from '@floating-ui/vue';

type HTMLElementRef = Ref<HTMLElement>;

const props = defineProps<{
  placement: Placement;
  target: HTMLElementRef | string;
}>();

const { placement } = toRefs(props);
const floatingRef = ref();
const targetRef = (
  typeof props.target === 'string' && props.target === 'parent' ?
  useParentElement(floatingRef):
  props.target as HTMLElementRef
);
const tooltipRef = ref();
const arrowRef = ref();
const {floatingStyles, middlewareData, update} = useFloating(targetRef, tooltipRef, {
  whileElementsMounted: autoUpdate,
  placement,
  middleware: [offset(6), flip(), shift({padding: 5}), arrow({element: arrowRef})],
});
const isHovered = useElementHover(targetRef)

watch(isHovered, (hover) => {
  if (hover) {
    tooltipRef.value.style.display = 'block'
    update();
  } else {
    tooltipRef.value.style.display = 'none'
  }
})

const arrowStyles = computed(() => {
  const arrow = middlewareData.value?.arrow;
  if (!arrow) {
    return {};
  }
  return {
    top: arrow.y !== null ? `${arrow.y}px` : '',
    left: arrow.y !== null ? `${arrow.x}px` : '',
  };
});
</script>

<template>
  <div ref="floatingRef">
    <div ref="tooltipRef" class="floating-wrapper" :style="floatingStyles">
      <div class="floating-content">
        <slot />
      </div>
      <div ref="arrowRef" class="floating-arrow" :style="arrowStyles"></div>
    </div>
  </div>
</template>

<style scoped>
.floating-wrapper {
  background-color: black;
  color: white;
  padding: 5px;
  border-radius: 4px;
}
.floating-arrow {
  position: absolute;
  background-color: black;
  width: 8px;
  height: 8px;
  transform: rotate(45deg);
}
</style>
