<script setup lang="ts">
import useIsTouch from '@/composables/useIsTouch';
import GridContainer from '@/components/GridContainer.vue';
import BlockText from '@/components/BlockText.vue';
import BlockImage from '@/components/BlockImage.vue';

type GridPosition = {
  start: number;
  span: number;
};

interface Project {
  title: string;
  gridPosition: {
    image1: GridPosition;
    text: GridPosition;
    image2: GridPosition;
  };
}

const props = defineProps<{
  enableMarginTop?: boolean;
  project: Project;
}>();

const { isTouch } = useIsTouch();

const computedClass = computed(() =>
  props.enableMarginTop ? 'marginTop' : '',
);
</script>

<template>
  <section :class="computedClass">
    <GridContainer>
      <BlockImage
        class="image-top"
        src="/images/project-1.png"
        :alt="props.project.title"
        :width="1439"
        :height="818"
        :start="props.project.gridPosition?.image1.start"
        :span="props.project.gridPosition?.image1.span"
        :isLeft="true"
        :noWebGL="isTouch"
      />
      <BlockText
        ref="blockTextRef"
        class="text"
        :style="{ gridColumnStart: props.project.gridPosition?.text.start }"
        fontSize="medium"
      >
        Vestibulum auctor congue sapien luctus. Integer at purus ac nisi
        sagittis laoreet. Nulla facilisi. Vivamus at.</BlockText
      >
    </GridContainer>
    <GridContainer>
      <BlockImage
        class="image-bottom"
        src="/images/project-2.png"
        :alt="props.project.title"
        :width="1080"
        :height="1440"
        :noWebGL="isTouch"
        :start="props.project.gridPosition?.image2.start"
        :span="props.project.gridPosition?.image2.span"
      />
    </GridContainer>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/variables/index.scss' as *;
section {
  &.marginTop {
    margin-top: 532px;

    @include media('<maximum') {
      margin-top: vw(400);
    }
  }
}
.text {
  margin-top: 10rem;
  margin-bottom: 10rem;
  grid-column-end: span 3;

  @include media('<=desktop') {
    grid-column-end: span 4;
  }
  @include media('<=tablet') {
    grid-column: 1 / -1 !important;
  }
}

.image-top {
  @include media('<=tablet') {
    grid-column: 1 / -1 !important;
  }
}
.image-bottom {
  @include media('<=tablet') {
    display: none;
  }
}
</style>
