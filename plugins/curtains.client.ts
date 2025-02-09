import { Curtains } from 'curtainsjs';

export default defineNuxtPlugin(nuxtApp => {
  const curtains = new Curtains({
    container: 'canvas',
  });

  return {
    provide: {
      curtains,
    },
  };
});
