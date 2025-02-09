<script setup lang="ts">
import { useTemplateRef } from 'vue';
import useScrollProgress from '@/composables/useScrollProgress';
import BlockText from '@/components/BlockText.vue';
import type { ScrollEvent } from '@/composables/useScrollProgress';

const introRef = useTemplateRef<HTMLElement>('introRef');
const showHero = ref<boolean>(false);

const onScroll = ({ progress }: ScrollEvent) => {
  if (progress > 0.55 && !showHero.value) {
    showHero.value = true;
  } else if (progress <= 0.55 && showHero.value) {
    showHero.value = false;
  }
};

useScrollProgress(introRef, {
  onScroll,
});
</script>

<template>
  <div class="introLoader__container" ref="introRef">
    <GridContainer class="introLoader">
      <BlockText
        class="title"
        :key="1"
        :animSplitText="{
          effect: 'letters',
          duration: 1,
          delay: 0,
          stagger: 0.04,
          trigger: !showHero,
        }"
        disableOnScrollSpeed
        >Studio name</BlockText
      >
      <BlockText
        class="description"
        fontSize="large"
        :key="2"
        :animSplitText="{
          effect: 'letters',
          duration: 1.5,
          delay: 0.4,
          stagger: 0.02,
          trigger: !showHero,
        }"
        disableOnScrollSpeed
        >Lorem ipsum dolor sit amet
      </BlockText>
      <BlockText
        class="scrollDown"
        :animCss="{
          effect: 'fade',
          delay: 1.4,
          trigger: !showHero,
        }"
        disableOnScrollSpeed
      >
        Scroll down
      </BlockText>
    </GridContainer>
  </div>
  <GridContainer class="hero__container">
    <BlockText
      class="hero"
      :animSplitText="{
        effect: 'randomLetters',
        trigger: showHero,
      }"
      fontSize="xl"
      tag="h1"
      disableOnScrollSpeed
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.</BlockText
    >
  </GridContainer>
</template>

<style scoped lang="scss">
@use '@/styles/variables/index.scss' as *;

.introLoader__container {
  height: 100vh;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
}
.introLoader {
  align-items: center;
  grid-row-gap: 33px;

  .title {
    grid-column: 2 / span 2;
    font-size: clamp(10px, vw(11), 17px);

    margin-top: vw(2);
    letter-spacing: 0.3rem;
    text-transform: uppercase;

    @include media('<=desktop') {
      font-size: vwM(6);
      grid-column: 1 / -1;
    }
    @include media('<=tablet') {
      font-size: vwM(10);
    }
  }

  .description {
    grid-column: 4 / span 6;

    @include media('<=large') {
      grid-column: 5 / span 5;
    }
    @include media('<=desktop') {
      grid-column: 1 / span 12;
    }
    @include media('<=tablet') {
      grid-column: 1 / -1;
    }
  }

  .scrollDown {
    grid-column: 10 / span 3;
    font-size: 14px;
    font-family: sans-serif;
    color: rgba($primary, 0.6);

    @include media('<=large') {
      grid-column: 10 / span 2;
    }
    @include media('<=desktop') {
      grid-column: 1 / span 12;
    }
  }
}

.hero__container {
  margin-top: -20vh;
  padding-bottom: 20vh;

  .hero {
    grid-column: 3 / span 4;

    @include media('<=desktop') {
      grid-column: 3 / span 5;
    }
    @include media('<=tablet') {
      grid-column: 1/-1;
    }
  }
}
</style>
