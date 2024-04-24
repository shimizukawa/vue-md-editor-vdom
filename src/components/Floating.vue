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

type Props = {
  to: HTMLElementRef | string;
  placement?: Placement;
};
const props = withDefaults(defineProps<Props>(), {
  placement: 'top',
});

const { placement: placementProp } = toRefs(props);
const floatingRef = ref();
const targetRef = (
  typeof props.to === 'string' && props.to === 'parent' ?
  useParentElement(floatingRef):
  props.to as HTMLElementRef
);
const tooltipRef = ref();
const arrowRef = ref();
const {floatingStyles, middlewareData, update, placement} = useFloating(targetRef, tooltipRef, {
  whileElementsMounted: autoUpdate,
  placement: placementProp,
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
  const p0 = placement.value.split('-')[0];
  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[p0] as string;
  const borderWidth = {
    top: '0 1px 1px 0',
    right: '0 0 1px 1px',
    bottom: '1px 0 0 1px',
    left: '1px 1px 0 0',
  }[p0] as string;
  return {
    top: arrow.y != null ? `${arrow.y}px` : '',
    left: arrow.x != null ? `${arrow.x}px` : '',
    right: '',
    bottom: '',
    [staticSide]: '-5px',
    borderWidth,
  };
});

const customFloatingStyles = computed(() => {
  const p0 = placement.value.split('-')[0];
  const boxShadow = {
    top: '0 4px 4px rgba(0, 0, 0, 0.2)',
    left: '4px 0 4px rgba(0, 0, 0, 0.2)',
    right: '-4px 0 4px rgba(0, 0, 0, 0.2)',
    bottom: '0 -4px 4px rgba(0, 0, 0, 0.2)',
  }[p0];
  return {
    ...floatingStyles.value,
    boxShadow,
  };
});
</script>

<template>
  <span ref="floatingRef">
    <Teleport to="body">
      <div ref="tooltipRef" class="floating-wrapper" :style="customFloatingStyles">
        <div class="floating-content">
          <slot />
        </div>
        <div ref="arrowRef" class="floating-arrow" :style="arrowStyles"></div>
      </div>
    </Teleport>
  </span>
</template>

<style scoped>
.floating-wrapper {
  background-color: white;
  color: black;
  padding: 7px;
  border: 1px solid black;
  border-radius: 4px;
  display: none;
  z-index: 10000;
}
.floating-arrow {
  position: absolute;
  background-color: white;
  border: 1px solid black;
  width: 8px;
  height: 8px;
  transform: rotate(45deg);
  box-sizing: border-box;
}
.floating-content {
  display: grid;
}
</style>
