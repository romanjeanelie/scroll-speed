<script setup lang="ts">
import { useTemplateRef } from 'vue';
import gsap from 'gsap';
import useScrollSpeed from '@/composables/useScrollSpeed';
import useScrollProgress from '@/composables/useScrollProgress';
import useGsapContext from '@/composables/useGsapContext';
import type { ScrollEvent } from '@/composables/useScrollProgress';

interface Project {
  title: string;
}

const props = defineProps<{
  projects?: Project[];
}>();

const { createContext } = useGsapContext();

const wrapperEl = useTemplateRef<HTMLElement>('wrapperEl');
const containerEl = useTemplateRef<HTMLElement>('containerEl');
const titlesRefs = useTemplateRef<HTMLElement[]>('titlesRefs');
const spreadFactor = ref(1);

function onScrollSpeedEnabled() {
  createContext(wrapperEl.value, () => {
    gsap.killTweensOf(['.text', '.container']);

    gsap.to('.container', {
      autoAlpha: 1,
      duration: 0.8,
      ease: 'power2.inOut',
    });
  });

  gsap.killTweensOf(spreadFactor);
  gsap.to(spreadFactor, {
    value: 0,
    duration: 1.5,
    ease: 'power1.out',
  });
}

function onScrollSpeedDisabled() {
  if (!wrapperEl.value) return;

  createContext(wrapperEl.value, () => {
    gsap.killTweensOf(['.text', '.container']);
    gsap.to('.container', {
      autoAlpha: 0,
      duration: 0.4,
    });
  });

  gsap.killTweensOf(spreadFactor);
  gsap.to(spreadFactor, {
    value: 1,
    duration: 2,
  });
}

useScrollSpeed(onScrollSpeedEnabled, onScrollSpeedDisabled);

useScrollProgress(wrapperEl, {
  onUpdate: ({ progressInPx }: ScrollEvent) => {
    if (!wrapperEl.value || !containerEl.value) return;
    const wrapperHeight = wrapperEl.value.offsetHeight;
    const containerHeight = containerEl.value.offsetHeight;
    const progress = gsap.utils.clamp(
      0,
      1,
      gsap.utils.mapRange(
        window.innerHeight,
        wrapperHeight,
        0,
        1,
        progressInPx,
      ),
    );

    const targetStart = window.innerHeight / 2;
    const targetEnd = wrapperHeight - containerHeight - window.innerHeight / 2;
    const translateY = gsap.utils.mapRange(
      0,
      1,
      targetStart,
      targetEnd,
      progress,
    );

    containerEl.value.style.transform = `translate3d(0px, ${translateY}px, 0px)`;

    if (!props.projects) return;
    const progressSections = gsap.utils.mapRange(
      0,
      1,
      0,
      props.projects?.length - 1,
      progress,
    );

    titlesRefs.value?.forEach((title, i) => {
      const distance = progressSections - i;
      const opacity = Math.max(1 - Math.round(Math.abs(distance)), 0.3);
      const translateY = 1 - distance * 100 * spreadFactor.value;

      title.style.opacity = `${opacity}`;
      title.style.transform = `translate3d(0px, ${translateY}px, 0px)`;
    });
  },
});
</script>

<template>
  <div ref="wrapperEl" class="wrapper">
    <div ref="containerEl" class="container">
      <p
        v-for="project in props.projects"
        :key="project.title"
        ref="titlesRefs"
        class="fontSize--xxl text"
        disableTransition
      >
        {{ project.title }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables/index.scss' as *;

.wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  overflow: hidden;
  pointer-events: none;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 5vh;
  justify-content: space-between;
  align-items: center;
  perspective: 1000px;
  visibility: hidden;
}

.text {
  transition: opacity 600ms ease;
  font-size: 6vh;
  font-weight: 100;
}
</style>
