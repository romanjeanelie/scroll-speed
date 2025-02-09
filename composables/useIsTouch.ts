import { ref, onMounted, onUnmounted } from 'vue';

export default function useIsTouch() {
  const isTouch = ref(false);

  const updateIsTouch = () => {
    isTouch.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  onMounted(() => {
    updateIsTouch();
  });

  return { isTouch };
}
