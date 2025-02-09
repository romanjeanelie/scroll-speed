<script lang="ts" setup>
import useIsTouch from '@/composables/useIsTouch';
import SectionTop from '@/components/SectionTop.vue';
import GridContainer from '@/components/GridContainer.vue';
import Project from '@/components/Project.vue';
import ProjectsTitles from '@/components/ProjectsTitles.vue';
import projects from '@/data/projects';

const { isTouch } = useIsTouch();
</script>

<template>
  <NuxtLayout>
    <SectionTop />
    <GridContainer>
      <BlockImage
        src="/images/hero.jpg"
        alt="hero image"
        :width="1920"
        :height="1080"
        class="image__center"
        :noWebGL="isTouch"
      />
    </GridContainer>
    <SectionIntro
      title="Lorem ipsum"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus."
      disableOnScrollSpeed
    />
    <div class="projects__wrapper" id="projects__wrapper">
      <Project
        v-for="(project, i) in projects.slice(0, 3)"
        :index="i"
        :key="project.title"
        :project="project"
        :enableMarginTop="i !== 0"
      />
      <SectionIntro
        title="Lorem ipsum"
        description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Mauris fermentum dictum magna."
      />
      <Project
        v-for="(project, i) in projects.slice(3)"
        :index="i"
        :key="project.title"
        :project="project"
        :enableMarginTop="i !== 0"
      />
      <ProjectsTitles :projects="projects" />
    </div>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
.projects__wrapper {
  position: relative;
}
</style>
