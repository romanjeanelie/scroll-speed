import { ref, onMounted, onUnmounted } from 'vue';
import { useNuxtApp } from '#app';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import debounce from '@/utils/debounce';

export type ScrollEvent = {
  progressInPx: number;
  progress: number;
  velocity: number;
};

export interface ScrollProgressOptions {
  threshold?: number;
  rootMargin?: string;
  onUpdate?: (event: ScrollEvent) => void;
  onScroll?: (event: ScrollEvent) => void;
}
class ScrollManager {
  private static instance: ScrollManager | null = null;
  private elements: Map<
    HTMLElement,
    {
      callback: (
        progressInPx: number,
        ratioProgress: number,
        velocity: number,
      ) => void;
      onUpdate?: (e: ScrollEvent) => void;
    }
  > = new Map();
  private elementDimensions: Map<HTMLElement, { top: number; height: number }> =
    new Map();
  private handleResize: () => void;
  private debouncedResize: (...args: any[]) => void;
  private lenis: Lenis;
  private ticking: boolean = false;
  private animationFrameId: number | null = null;
  private frameCount: number = 0;

  private constructor() {
    const nuxtApp = useNuxtApp();
    this.lenis = nuxtApp.$lenis;
    this.lenis.on('scroll', this.onScroll);
    this.startAnimationLoop();

    this.handleResize = () => {
      this.elements.forEach((_, element) => {
        this.updateElementDimensions(element);
      });
      this.updateAllElements();
    };
    this.debouncedResize = debounce(this.handleResize, 100);
    window.addEventListener('resize', this.debouncedResize);
  }

  static getInstance(): ScrollManager {
    if (!ScrollManager.instance) {
      ScrollManager.instance = new ScrollManager();
    }
    return ScrollManager.instance;
  }

  private updateElementDimensions(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    this.elementDimensions.set(element, {
      top: rect.top + window.scrollY,
      height: rect.height,
    });
  }

  private startAnimationLoop() {
    const animate = () => {
      this.frameCount++;

      this.elements.forEach(({ onUpdate }, element) => {
        if (onUpdate) {
          const { progressInPx, ratioProgress } =
            this.calculateProgress(element);
          onUpdate({
            progressInPx,
            progress: ratioProgress,
            velocity: this.lenis.velocity,
          });
        }
      });
      this.animationFrameId = requestAnimationFrame(animate);
    };
    animate();
  }

  private onScroll = () => {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.updateAllElements();
        this.ticking = false;
      });
      this.ticking = true;
    }
  };

  private updateAllElements() {
    this.elements.forEach(({ callback }, element) => {
      const { progressInPx, ratioProgress } = this.calculateProgress(element);
      callback(progressInPx, ratioProgress, this.lenis.velocity);
    });
  }

  private calculateProgress(element: HTMLElement): {
    progressInPx: number;
    ratioProgress: number;
  } {
    const dimensions = this.elementDimensions.get(element);
    if (!dimensions) return { progressInPx: 0, ratioProgress: 0 };

    const start = dimensions.top - window.innerHeight;
    const end = dimensions.top + dimensions.height;
    const progressInPx = this.lenis.animatedScroll - start;
    const ratioProgress = gsap.utils.clamp(
      0,
      1,
      gsap.utils.mapRange(start, end, 0, 1, this.lenis.animatedScroll),
    );

    return { progressInPx, ratioProgress };
  }

  addElement(
    element: HTMLElement,
    callback: (
      progressInPx: number,
      ratioProgress: number,
      velocity: number,
    ) => void,
    onUpdate?: (e: ScrollEvent) => void,
  ) {
    this.elements.set(element, { callback, onUpdate });
    this.updateElementDimensions(element);
    this.updateElementDimensions(element);
    const { progressInPx, ratioProgress } = this.calculateProgress(element);
    callback(progressInPx, ratioProgress, this.lenis.velocity);
  }

  removeElement(element: HTMLElement) {
    this.elements.delete(element);
    this.elementDimensions.delete(element);
  }

  destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.lenis.off('scroll', this.onScroll);
    window.removeEventListener('resize', this.debouncedResize);
    this.elements.clear();
    this.elementDimensions.clear();
    ScrollManager.instance = null;
  }
}

export default function useScrollProgress(
  elementRef: Ref<HTMLElement | null>,
  options: ScrollProgressOptions = {},
) {
  const progressInPx = ref(0);
  const progress = ref(0);
  const clampedProgress = ref(0);
  const isInView = ref(false);
  const velocity = ref(0);

  onMounted(() => {
    if (elementRef.value) {
      const scrollManager = ScrollManager.getInstance();
      scrollManager.addElement(
        elementRef.value,
        (newProgressInPx, newRatioProgress, newVelocity) => {
          progressInPx.value = newProgressInPx;
          progress.value = newRatioProgress;
          clampedProgress.value = gsap.utils.clamp(0, 1, newRatioProgress);
          isInView.value = newRatioProgress > 0 && newRatioProgress < 1;
          velocity.value = newVelocity;
          if (options.onScroll)
            options.onScroll({
              progressInPx: newProgressInPx,
              progress: newRatioProgress,
              velocity: newVelocity,
            });
        },
        options.onUpdate,
      );
    }
  });

  onUnmounted(() => {
    if (elementRef.value) {
      const scrollManager = ScrollManager.getInstance();
      scrollManager.removeElement(elementRef.value);
    }
  });

  return {
    progressInPx,
    progress,
    clampedProgress,
    isInView,
    velocity,
  };
}
