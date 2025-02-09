<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue';
import isUndefined from 'lodash/isUndefined';
import useScrollSpeed from '@/composables/useScrollSpeed';
import useSplitText from '@/composables/useSplitText';
import useAnimationCSS from '@/composables/useAnimationCSS';
import { effects } from '@/components/motion/effects';
import type { EffectName } from '@/components/motion/effects';
import type {
  AnimationCSSType,
  AnimationSplitTextType,
} from '@/components/motion/types';

const fontSizeClasses: Record<string, string> = {
  small: 'fontSize--small',
  large: 'fontSize--large',
  medium: 'fontSize--medium',
  xl: 'fontSize--xl',
  xxl: 'fontSize--xxl',
};

const props = defineProps<{
  fontSize?: keyof typeof fontSizeClasses;
  tag?: 'p' | 'h1' | 'h2' | 'div' | 'span';
  disableTransition?: boolean;
  animSplitText?: AnimationSplitTextType;
  animCss?: AnimationCSSType;
  disableOnScrollSpeed?: boolean;
  trigger?: any;
}>();

const elRef = useTemplateRef<HTMLElement>('elRef');
const isMounted = ref(false);
const isScrollSpeed = ref(false);

// Split text
if (props.animSplitText) {
  const effectSelected = effects[props.animSplitText.effect as EffectName];
  useSplitText({
    el: elRef,
    ...effectSelected,
    ...props.animSplitText,
    trigger: !isUndefined(props.animSplitText?.trigger)
      ? () => props.animSplitText?.trigger
      : undefined,
  });
}

// Computed classes
const { effectClass } = useAnimationCSS({
  el: elRef,
  ...props.animCss,
  effect: props.animCss?.effect as string,
  trigger: !isUndefined(props.animCss?.trigger)
    ? () => props.animCss?.trigger
    : undefined,
  disable: isUndefined(props.animCss),
});

const { effectClass: scrollSpeedEffectClass } = useAnimationCSS({
  el: elRef,
  effect: 'scrollSpeed',
  trigger: () => isScrollSpeed.value,
  disable: props.disableOnScrollSpeed,
});

const computedClasses = computed(() => {
  const fontSizeClass = props.fontSize
    ? fontSizeClasses[props.fontSize] || ''
    : '';
  const transitionClass = props.disableTransition ? 'no-transition' : '';
  const animatedClass = !props.animCss && !isMounted.value ? 'animated' : '';
  return `${fontSizeClass} ${transitionClass} ${animatedClass} ${effectClass.value} ${scrollSpeedEffectClass.value}`.trim();
});

onMounted(() => {
  isMounted.value = true;
});

// On scroll speed
function onScrollSpeedEnabled() {
  isScrollSpeed.value = true;
}

function onScrollSpeedDisabled() {
  isScrollSpeed.value = false;
}

useScrollSpeed(onScrollSpeedEnabled, onScrollSpeedDisabled);
</script>

<template>
  <component
    ref="elRef"
    :is="props.tag || `p`"
    :class="['blockText', computedClasses]"
  >
    <slot></slot>
  </component>
</template>

<style lang="scss" scoped>
@use '@/styles/variables/index.scss' as *;

.blockText {
  transform: translate3d(0, 0, 0);
  visibility: visible;

  &.animated {
    visibility: hidden;
  }
}
</style>
