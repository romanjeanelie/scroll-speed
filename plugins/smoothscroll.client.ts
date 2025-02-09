import Lenis from 'lenis';

export default defineNuxtPlugin(() => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  window.scrollTo(0, 0);

  const lenis = new Lenis({
    autoRaf: true,
    lerp: 0.07,
    duration: 3,
    syncTouch: true,
    touchMultiplier: 1.5,
  });

  return {
    provide: {
      lenis,
    },
  };
});
