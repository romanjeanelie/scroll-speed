<script setup lang="ts">
const props = defineProps<{
  title: string;
  description: string;
  disableOnScrollSpeed?: boolean;
}>();
</script>

<template>
  <GridContainer class="intro">
    <BlockText
      class="title"
      :animSplitText="{
        effect: 'revealLines',
      }"
      fontSize="medium"
      :disableOnScrollSpeed="props.disableOnScrollSpeed"
      >{{ props.title }}</BlockText
    >
    <BlockText
      class="description"
      :animSplitText="{
        effect: 'revealLines',
      }"
      fontSize="xl"
      :disableOnScrollSpeed="props.disableOnScrollSpeed"
    >
      {{ props.description }}
    </BlockText>
  </GridContainer>
</template>

<style lang="scss" scoped>
@use '@/styles/variables/index.scss' as *;

.intro {
  min-height: 100vh;
  align-content: center;
  padding-top: clamp(0px, vw(300), 210px);
  padding-bottom: clamp(0px, vw(300), 210px);
  row-gap: 6rem;

  @media (max-aspect-ratio: 4 / 3) {
    min-height: 70vw;
  }

  @include media('<=tablet') {
    min-height: 100vh;
  }
  p {
    text-align: center;
  }

  .title {
    grid-column: 5 / span 4;

    @include media('<=tablet') {
      grid-column: 1 / span 12;
    }
  }
  .description {
    grid-column: 4 / span 6;

    @include media('<=tablet') {
      grid-column: 1 / span 12;
    }
  }
}
</style>
