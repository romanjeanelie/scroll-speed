<script setup lang="ts"></script>

<template>
  <div id="app">
    <NuxtRouteAnnouncer />
    <main>
      <slot />
    </main>
  </div>
  <div id="canvas"></div>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
