<script setup lang="ts">
// This component is used to render a floating tooltip by @floating-ui/vue.
// Usage is almost the same as vue-tippy.
// 
// <Floating placement="top">
//   <template #default>
//     <button>
//       Button with floating tooltip
//     </button>
//   </template>
//   <template #content>
//     My Long Long Long Long Long Long Long Long Long Long Tooltip
//   </template>
// </Floating>
//
// props
//
// - placement: string, see https://floating-ui.com/docs/usefloating#placement
// - interactive: keeping the tooltip open when the user hovers over the tooltip, default false
// - delay: [delayEnter, delayLeave] for hover, default 0 (means [0, 0])
// - arrow: boolean, default true
// - class: string as css class, default undefined.
// - maxWidth: string as css width, default undefined.
// - theme: string as data-theme, default undefined.
//
// theme
//
// <Floating theme="warning">
//   ...
//
// <style>
// .floating-wrapper[data-theme~="warning"] {
//   background-color: yellow;
//   color: red;
//   border-color: red;
// }
// .floating-arrow[data-theme~="warning"] { ... }
// .floating-content[data-theme~="warning"] { ... }

import { ref, watch, computed, toRefs } from 'vue';
import { useElementHover } from '@vueuse/core'
import * as floating from "@floating-ui/vue";
import type { Placement } from '@floating-ui/vue';

// define props ----

type Props = {
  placement?: Placement;
  interactive?: boolean;
  delay?: number | [number, number];
  arrow?: boolean;
  class?: string;
  maxWidth?: string;
  theme?: string;
};
const props = withDefaults(defineProps<Props>(), {
  placement: "top",
  interactive: false,
  delay: 0,
  arrow: true,
});
const slots = defineSlots();

// define varibales ----

const {
  placement: placementProp,
  interactive,
  delay,
  arrow: arrowProp,
  class: classProp,
  maxWidth: maxWidthProp,
  theme: themeProp,
} = toRefs(props);

const targetRef = ref();
const floatingRef = ref();
const arrowRef = ref();

// floating

const {
  floatingStyles,
  middlewareData,
  update,
  placement: placed,
} = floating.useFloating(targetRef, floatingRef, {
  whileElementsMounted: floating.autoUpdate,
  placement: placementProp,
  middleware: [
    floating.offset(6),
    floating.flip(),
    floating.shift({ padding: 5 }),
    floating.arrow({ element: arrowRef }),
  ],
});

const delayOptions = computed(() => {
  const [delayEnter, delayLeave] = Array.isArray(delay.value)
    ? delay.value
    : [delay.value, delay.value];
  return { delayEnter, delayLeave };
});

// hover states ----

const isTargetHovered = useElementHover(targetRef, {
  delayEnter: delayOptions.value.delayEnter,
  delayLeave: delayOptions.value.delayLeave + (interactive.value ? 100 : 0),
});
const isTooltipHovered = useElementHover(floatingRef, {
  delayEnter: 0, // keep tooltip open when hovering over the tooltip
  delayLeave: delayOptions.value.delayLeave,
});
const isHovered = computed((): boolean => {
  if (interactive.value) {
    return isTargetHovered.value || isTooltipHovered.value;
  } else {
    return isTargetHovered.value;
  }
});

watch(isHovered, (hover) => {
  if (hover) {
    update();
  }
});

// styles

const arrowStyles = computed(() => {
  const arrow = middlewareData.value?.arrow;
  if (!arrow || !arrowProp.value) {
    return {};
  }
  const p0 = placed.value.split("-")[0];
  const staticSide = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  }[p0] as string;
  const borderWidth = {
    top: "0 1px 1px 0",
    right: "0 0 1px 1px",
    bottom: "1px 0 0 1px",
    left: "1px 1px 0 0",
  }[p0] as string;
  return {
    top: arrow.y != null ? `${arrow.y}px` : "",
    left: arrow.x != null ? `${arrow.x}px` : "",
    right: "",
    bottom: "",
    [staticSide]: "-5px",
    borderWidth,
  };
});

const customFloatingStyles = computed(() => {
  const p0 = placed.value.split("-")[0];
  const boxShadow = {
    top: "0 4px 4px rgba(0, 0, 0, 0.2)",
    left: "4px 0 4px rgba(0, 0, 0, 0.2)",
    right: "-4px 0 4px rgba(0, 0, 0, 0.2)",
    bottom: "0 -4px 4px rgba(0, 0, 0, 0.2)",
  }[p0];
  return {
    ...floatingStyles.value,
    boxShadow,
    maxWidth: maxWidthProp.value,
  };
});
</script>

<template>
  <span ref="targetRef">
    <slot />
  </span>
  <Teleport to="body">
    <div
      v-if="isHovered"
      ref="floatingRef"
      class="floating-wrapper"
      :class="classProp"
      :data-theme="themeProp"
      :style="customFloatingStyles"
    >
      <div class="floating-content" :data-theme="themeProp">
        <slot name="content" />
      </div>
      <div
        v-if="arrowProp"
        ref="arrowRef"
        class="floating-arrow"
        :style="arrowStyles"
        :data-theme="themeProp"
      />
    </div>
  </Teleport>
</template>

<style scoped>
.floating-wrapper {
  background-color: white;
  color: black;
  border: 1px solid black;
  border-radius: 4px;
  padding: 7px;
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
