import type { UseAnimationCSSType } from '@/components/motion/types';
import isUndefined from 'lodash/isUndefined';
import useScrollProgress from '@/composables/useScrollProgress';

export interface AnimationCSSOptions extends UseAnimationCSSType {
  el: Ref<HTMLElement | null>;
  disable?: boolean;
}

export default function useAnimationCSS(options: AnimationCSSOptions) {
  const { el, trigger, effect, delay = 0, disable = false } = options;
  const effectClass = ref('');
  const timer = ref<ReturnType<typeof setTimeout> | null>(null);

  if (disable) {
    return { effectClass };
  }

  effectClass.value = `${effect}-init`;

  function getEffectClass(isActive: boolean): Promise<string> {
    return new Promise(resolve => {
      if (timer.value) clearTimeout(timer.value);

      if (!isActive) {
        resolve(`${effect}-out`);
      } else {
        timer.value = setTimeout(() => {
          resolve(`${effect}-in`);
        }, delay * 1000 || 0);
      }
    });
  }

  if (!isUndefined(trigger)) {
    watch([trigger, el], async ([newTrigger]) => {
      effectClass.value = await getEffectClass(!!newTrigger);
    });
  } else {
    const { isInView } = useScrollProgress(el);
    watch([isInView, el], async ([newIsInView]) => {
      effectClass.value = await getEffectClass(newIsInView);
    });
  }

  onUnmounted(() => {
    if (timer.value) {
      clearTimeout(timer.value);
    }
  });

  return {
    effectClass,
  };
}
