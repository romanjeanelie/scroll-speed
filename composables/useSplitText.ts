import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import _ from 'lodash';
import isUndefined from 'lodash/isUndefined';
import type { SplitText as SplitTextType } from 'gsap/SplitText';
import useScrollProgress from '@/composables/useScrollProgress';
import { useResize } from './useResize';
import { getSplitText, applyEffect, Masking } from '@/components/motion/utils';
import type { ScrollEvent } from '@/composables/useScrollProgress';
import type { UseAnimationSplitTextType } from '@/components/motion/types';

export interface SplitTextOptions extends UseAnimationSplitTextType {
  el: Ref<HTMLElement | null>;
  splitType?: 'lines' | 'words' | 'chars';
  masking?: boolean;
}

export default function useSplitText(options: SplitTextOptions) {
  if (import.meta.client) {
    gsap.registerPlugin(SplitText);
  }

  const {
    el,
    splitType = 'lines',
    masking = false,
    threshold,
    trigger,
    duration,
    delay,
    stagger,
  } = options;

  const elSplit = ref<SplitTextType | null>(null);
  const splitTypeWithWords = computed(() =>
    splitType === 'chars' ? 'chars,words' : splitType,
  );
  const selector = ref<any | null>(null);

  const onResize = () => {
    destroy();
    init();
  };

  useResize({ el, onResize, checkWindowResize: true });

  // Type: threshold
  const isTriggered = ref(false);
  const onScroll = ({ progress }: ScrollEvent) => {
    if (threshold) {
      if (!elSplit.value) return;
      if (progress > threshold && !isTriggered.value) {
        isTriggered.value = true;
        anim();
      } else if (progress < threshold && isTriggered.value) {
        isTriggered.value = false;
        reverseAnim();
      }
    }
  };

  const { isInView, progress: scrollProgress } = useScrollProgress(el, {
    onScroll,
  });

  // Type: trigger
  if (!isUndefined(trigger)) {
    watch([trigger, elSplit], ([newTrigger]) => {
      if (elSplit.value) {
        newTrigger ? anim() : reverseAnim();
      }
    });
  }

  // Type: Default
  if (isUndefined(threshold) && isUndefined(trigger)) {
    watch([isInView, elSplit], ([newIsInView]) => {
      if (!elSplit.value) return;

      if (newIsInView && scrollProgress.value < 0.9) {
        anim();
      } else if (!newIsInView && scrollProgress.value === 0) {
        resetAnim();
      } else if (!newIsInView && scrollProgress.value === 1) {
        anim();
      }
    });
  }

  // Anim
  function anim() {
    if (!options.in.to) return;
    gsap.killTweensOf(getElement());
    applyEffect({
      el: getElement(),
      configs: options.in.to,
      duration,
      delay,
      stagger,
    });
  }

  function resetAnim() {
    gsap.killTweensOf(getElement());
    if (options.init) {
      gsap.set(getElement(), options.init);
    }
  }

  function reverseAnim() {
    gsap.killTweensOf(getElement());
    if (options.out?.to) {
      applyEffect({ el: getElement(), configs: options.out.to });
    } else if (options.in?.to) {
      applyEffect({
        el: getElement(),
        configs: options.in.to,
        runBackwards: true,
      });
    }
  }

  // Set up
  function init() {
    if (!el.value) return;
    elSplit.value = getSplitText(el.value, splitTypeWithWords.value);
    if (masking && elSplit.value?.lines) {
      Masking(elSplit.value.lines);
    }
  }

  function destroy() {
    elSplit.value?.revert();
  }

  function getElement() {
    if (!selector.value) return null;
    return selector.value(`.${[splitType]}`);
  }

  onMounted(() => {
    selector.value = gsap.utils.selector(el.value);
    document.fonts.ready.then(() => {
      init();
      if (elSplit.value && options.init) {
        gsap.set(getElement(), options.init);
      }
    });
  });

  onUnmounted(() => {
    destroy();
  });
}
