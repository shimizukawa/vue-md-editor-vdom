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
//     <div style="max-width: 300px;">
//       My Long Long Long Long Long Long Long Long Long Long Tooltip
//     </div>
//   </template>
// </Floating>
//
// props
//
// - placement: string, see https://floating-ui.com/docs/usefloating#placement
// - interactive: keeping the tooltip open when the user hovers over the tooltip, default false
// - delay: [delayEnter, delayLeave] for hover, default 0 (means [0, 0])
// - arrow: boolean, default true
// - theme: string as data-theme, default 'light'.
// - trigger: boolean to control the tooltip visibility.
// - onShow: () => void, callback when the tooltip is shown.
// - onHide: () => void, callback when the tooltip is hidden.
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

import { ref, watch, computed, toRefs } from "vue";
import type { Ref } from "vue";
import { useElementHover } from "@vueuse/core";
import * as floating from "@floating-ui/vue";
import type { Placement, VirtualElement } from "@floating-ui/vue";

// interface ----

type OnShowFn = () => void;
type OnHideFn = () => void;

type Props = {
  target?: HTMLElement | VirtualElement;
  placement?: Placement;
  interactive?: boolean;
  inline?: boolean;
  delay?: number | [number, number];
  arrow?: boolean;
  theme?: string;
  trigger?: boolean;
  onShow?: OnShowFn;
  onHide?: OnHideFn;
};
const props = withDefaults(defineProps<Props>(), {
  target: undefined,
  placement: "top",
  interactive: false,
  inline: false,
  delay: 0,
  arrow: true,
  theme: "light",
  trigger: undefined,
});
const slots = defineSlots();

// define varibales ----

const {
  target: targetProp,
  placement: placementProp,
  interactive,
  inline,
  delay,
  arrow: arrowProp,
  theme: themeProp,
  trigger: triggerProp,
} = toRefs(props);

const defaultSlotRef = ref();
const targetRef = computed((): HTMLElement | VirtualElement =>
  targetProp.value ?? defaultSlotRef.value
); // targetRef変数を消せるかも？HMRで動作する？
const floatingRef = ref();
const arrowRef = ref();

// define floating

const {
  floatingStyles,
  middlewareData,
  update,
  placement: placed,
} = floating.useFloating(targetRef, floatingRef, {
  whileElementsMounted: floating.autoUpdate,
  placement: placementProp,
  middleware: [
    ...(inline.value ? [floating.inline()] : []),
    floating.offset(6),
    floating.flip({ fallbackAxisSideDirection: "end", crossAxis: false }),
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

const isUsingDefaultSlot = computed((): boolean => {
  return !targetProp.value;
});

// define trigger states ----

const triggerRef = triggerProp.value !== undefined ?
  triggerProp as Ref<boolean> :
  useElementHover(defaultSlotRef, {
    delayEnter: delayOptions.value.delayEnter,
    delayLeave: delayOptions.value.delayLeave + (interactive.value ? 100 : 0),
  });
const isTooltipHovered = useElementHover(floatingRef, {
  delayEnter: 0, // keep tooltip open when hovering over the tooltip
  delayLeave: delayOptions.value.delayLeave,
});
const isTriggered = computed((): boolean => {
  const t = triggerRef.value || (interactive.value && isTooltipHovered.value);
  return t;
});

watch(isTriggered, (show) => {
  if (show) {
    props.onShow?.();
  } else {
    props.onHide?.();
  }
});

// define styles ----

const placed0 = computed(() => {
  return placed.value.split("-")[0];
});

const arrowStyles = computed(() => {
  const arrow = middlewareData.value?.arrow;
  if (!arrow || !arrowProp.value) {
    return {};
  }
  return {
    top: arrow.y != null ? `${arrow.y}px` : "",
    left: arrow.x != null ? `${arrow.x}px` : "",
    right: "",
    bottom: "",
  };
});
</script>

<template>
  <span v-if="isUsingDefaultSlot" ref="defaultSlotRef">
    <slot />
  </span>
  <Teleport v-if="slots.content" to="body">
    <div
      v-if="isTriggered"
      ref="floatingRef"
      class="floating-wrapper"
      :data-theme="themeProp"
      :data-placement="placed0"
      :style="floatingStyles"
    >
      <div class="floating-content" :data-theme="themeProp">
        <slot name="content" />
      </div>
      <div
        v-if="arrowProp"
        ref="arrowRef"
        class="floating-arrow"
        :data-theme="themeProp"
        :style="arrowStyles"
      />
    </div>
  </Teleport>
</template>

<style>
/* Want to use global scope css, so not using `scoped`.
 * And I want to define it near the component implementation instead of external css file.
 */

.floating-wrapper {
  background-color: white;
  border: 1px solid black;
  border-radius: 3px;
  z-index: 10000;

  .floating-content {
    display: grid;
    background-color: white;
    border-radius: 3px;
    z-index: 10002;
  }

  .floating-arrow {
    position: absolute;
    background-color: white;
    border: 0px solid black;
    width: 8px;
    height: 8px;
    transform: rotate(45deg);
    box-sizing: border-box;
    z-index: 10001;
  }
}

.floating-wrapper[data-theme~="light"] {
  background-color: white;
  border: 1px solid black;
  box-shadow: 0 4px 4px rgb(0 0 0 / .2);

  .floating-content {
    background-color: white;
  }

  .floating-arrow {
    background-color: white;
    border: 0px solid black;
  }
}

.floating-wrapper[data-placement~="top"] {
  .floating-arrow {
    border-width: 0 1px 1px 0;
    bottom: -5px !important;
  }
}
.floating-wrapper[data-placement~="right"] {
  .floating-arrow {
    border-width: 0 0 1px 1px;
    left: -5px !important;
  }
}
.floating-wrapper[data-placement~="bottom"] {
  .floating-arrow {
    border-width: 1px 0 0 1px;
    top: -5px !important;
  }
}
.floating-wrapper[data-placement~="left"] {
  .floating-arrow {
    border-width: 1px 1px 0 0;
    right: -5px !important;
  }
}
</style>
