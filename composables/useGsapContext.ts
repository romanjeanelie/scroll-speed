import { ref, onUnmounted } from 'vue';
import gsap from 'gsap';

export default function useGsapContext() {
  const ctx = ref<gsap.Context | null>(null);

  function createContext(target: HTMLElement | null, animationFn: () => void) {
    if (!target) return;

    ctx.value?.revert();
    ctx.value = gsap.context(animationFn, target);
  }

  onUnmounted(() => {
    ctx.value?.revert();
  });

  return { createContext };
}
