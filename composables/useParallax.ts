import { gsap } from 'gsap';

type ParallaxAxis = 'x' | 'y' | 'both';

interface ParallaxOptions {
  elRef: Ref<HTMLElement | null>;
  innerElement?: boolean;
  speed?: number;
  axis?: ParallaxAxis;
  easing?: (progress: number) => number;
  minTranslate?: number;
  maxTranslate?: number;
}

export default function useParallax({
  elRef,
  innerElement = true,
  speed = 0.3,
  axis = 'y',
  easing = gsap.parseEase('linear'),
  minTranslate = -100,
  maxTranslate = 100,
}: ParallaxOptions) {
  const scale = innerElement ? 1 / (1 - speed) : 1;

  const updateParallax = (newRatioProgress: number) => {
    if (!elRef.value) return;

    const easedProgress = easing(newRatioProgress);
    const translation =
      gsap.utils.mapRange(0, 1, -speed, speed, easedProgress) * 100;
    const clampedTranslation = gsap.utils.clamp(
      minTranslate,
      maxTranslate,
      translation,
    );

    if (innerElement) {
      elRef.value.style.overflow = 'hidden';
      const firstChild = elRef.value.firstElementChild as HTMLElement;

      if (firstChild) {
        const translateX =
          axis === 'x' || axis === 'both' ? `${clampedTranslation}%` : '0px';
        const translateY =
          axis === 'y' || axis === 'both' ? `${clampedTranslation}%` : '0px';

        firstChild.style.transform = `scale(${scale}) translate3d(${translateX}, ${translateY}, 0px)`;
      }
    }
  };

  return {
    updateParallax,
  };
}
