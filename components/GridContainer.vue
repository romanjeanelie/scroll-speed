<script></script>

<template>
  <div class="gridContainer">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables/index.scss' as *;

.gridContainer {
  @include gridColumn;
  width: 100%;
  max-width: 2088px;
  padding: 0 16px;

  @include media('<=tablet') {
    padding: 0 32px;
  }
}
</style>
