<script lang="ts" setup>
import { useTemplateRef } from 'vue';
import useScrollSpeed from '@/composables/useScrollSpeed';
import useScrollProgress from '@/composables/useScrollProgress';
import useParallax from '@/composables/useParallax';
import useWebGLPlane from '@/composables/useWebGLPlane';
import type { ParallaxOptions } from '@/components/motion/types';

const props = defineProps<{
  src: string;
  alt: string;
  width?: number;
  height?: number;
  start?: number;
  span?: number;
  parallax?: ParallaxOptions;
  noWebGL?: boolean;
  isLeft?: boolean;
}>();

const imgContainerRef = useTemplateRef<HTMLElement>('imgContainerRef');

const computedClass = computed(() => (props.noWebGL ? 'noWeblg' : ''));

const { updatePlane, onSpeedEnabled, onSpeedDisabled } = useWebGLPlane({
  elRef: imgContainerRef,
  disable: props.noWebGL,
});

const { updateParallax } = useParallax({
  elRef: imgContainerRef,
  speed: props.parallax?.speed,
});

useScrollProgress(imgContainerRef, {
  onUpdate: ({ progressInPx, progress }: ScrollEvent) => {
    updatePlane(progressInPx, progress);
    if (props.parallax && props.noWebGL) {
      updateParallax(progress);
    }
  },
});

useScrollSpeed(onSpeedEnabled, onSpeedDisabled);
</script>

<template>
  <div
    ref="imgContainerRef"
    :class="computedClass"
    :style="
      props.start && props.span
        ? {
            gridColumnStart: props.start,
            gridColumnEnd: `span ${props.span}`,
          }
        : {}
    "
  >
    <NuxtImg
      :src="props.src"
      :alt="props.alt"
      :width="props.width"
      :height="props.height"
      loading="lazy"
    />
  </div>
</template>

<style lang="scss" scoped>
div {
  img {
    width: 100%;
    height: auto;
    visibility: hidden;
  }

  &.noWeblg {
    img {
      visibility: visible;
    }
  }
}
</style>
