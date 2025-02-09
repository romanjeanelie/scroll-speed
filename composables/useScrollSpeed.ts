import { onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import Lenis from 'lenis';
import useIsTouch from '@/composables/useIsTouch';
import lerp from '@/utils/lerp';

class ScrollSpeedManager {
  private readonly scrollSpeed = 0.003;
  private readonly animationOutDelay = 500;
  private static instance: ScrollSpeedManager | null = null;
  private speedEnabledCallbacks = new Set<() => void>();
  private speedDisabledCallbacks = new Set<() => void>();
  private timer: ReturnType<typeof setTimeout> | null = null;
  private enable = false;
  private scroll = { current: 0, target: 0 };
  private readonly minScrollVelocity = 70;
  private speed = 0;
  private limitScrollTop = 0;
  private lenis: Lenis;
  private resizeObserver: ResizeObserver | null = null;
  private projectsWrapperEl: HTMLElement | null = null;

  private constructor() {
    const nuxtApp = useNuxtApp();
    this.lenis = nuxtApp.$lenis;
    this.projectsWrapperEl = document.getElementById('projects__wrapper');

    this.setResizeObserver();
    window.addEventListener('wheel', this.onWheelHandler, { passive: true });
    gsap.ticker.add(this.onUpdate);
  }

  static getInstance(): ScrollSpeedManager {
    if (!ScrollSpeedManager.instance) {
      ScrollSpeedManager.instance = new ScrollSpeedManager();
    }
    return ScrollSpeedManager.instance;
  }

  private updateLimitScrollTop(el: HTMLElement | null) {
    if (el) {
      this.limitScrollTop = el.offsetTop;
      this.speed = el.offsetHeight * this.scrollSpeed;
    }
  }
  private setResizeObserver() {
    this.resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        this.updateLimitScrollTop(entry.target as HTMLElement);
      });
    });
    if (this.projectsWrapperEl) {
      this.resizeObserver.observe(this.projectsWrapperEl);
    }
  }

  private enableScrollSpeed() {
    this.enable = true;
    this.speedEnabledCallbacks.forEach(callback => {
      callback();
    });
  }

  private disableScrollSpeed() {
    this.enable = false;
    this.speedDisabledCallbacks.forEach(callback => callback());
  }

  private readonly TARGET_FPS = 60;
  private readonly MS_PER_FRAME = 1000 / this.TARGET_FPS;
  private lastDeltaTime = this.MS_PER_FRAME;
  private targetLerpSpeed = 0.6;

  private onWheelHandler = (e: WheelEvent) => {
    const { animatedScroll, dimensions, velocity } = this.lenis;
    const { deltaY } = e;

    let newScroll = gsap.utils.clamp(
      this.limitScrollTop,
      dimensions.scrollHeight,
      animatedScroll + deltaY * this.speed,
    );
    this.scroll.target = newScroll;

    const normalizedVelocity =
      velocity * (this.MS_PER_FRAME / this.lastDeltaTime);

    if (
      Math.abs(normalizedVelocity) > this.minScrollVelocity &&
      animatedScroll > this.limitScrollTop
    ) {
      if (!this.enable) {
        this.enableScrollSpeed();
      }
    }

    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (this.enable) this.disableScrollSpeed();
    }, this.animationOutDelay);
  };

  private onUpdate = (time: number, deltaTime: number) => {
    if (this.enable) {
      if (!this.lenis.isStopped) {
        this.lenis.stop();
        this.scroll.current = this.scroll.target;
      }

      const lerpFactor = this.targetLerpSpeed * (deltaTime / 1000);

      if (this.lastDeltaTime !== deltaTime) {
        this.lastDeltaTime = deltaTime;
      }

      this.scroll.current = lerp(
        this.scroll.current,
        this.scroll.target,
        lerpFactor,
      );
      this.lenis.scrollTo(this.scroll.current, { force: true });
    } else if (this.lenis.isStopped) {
      this.lenis.start();
    }
  };

  public addCallbacks(onSpeedEnabled: () => void, onSpeedDisabled: () => void) {
    this.speedEnabledCallbacks.add(onSpeedEnabled);
    this.speedDisabledCallbacks.add(onSpeedDisabled);
  }

  public removeCallbacks(
    onSpeedEnabled: () => void,
    onSpeedDisabled: () => void,
  ) {
    this.speedEnabledCallbacks.delete(onSpeedEnabled);
    this.speedDisabledCallbacks.delete(onSpeedDisabled);
  }

  public destroy() {
    if (import.meta.client) {
      this.resizeObserver?.disconnect();
      this.resizeObserver = null;

      window.removeEventListener('wheel', this.onWheelHandler);
      gsap.ticker.remove(this.onUpdate);
      ScrollSpeedManager.instance = null;
    }
  }
}

export default function useScrollSpeed(
  onSpeedEnabled: () => void,
  onSpeedDisabled: () => void,
) {
  const { isTouch } = useIsTouch();

  onMounted(() => {
    if (isTouch.value) return;
    const manager = ScrollSpeedManager.getInstance();
    manager.addCallbacks(onSpeedEnabled, onSpeedDisabled);
  });

  onUnmounted(() => {
    if (isTouch.value) return;
    const manager = ScrollSpeedManager.getInstance();
    manager.removeCallbacks(onSpeedEnabled, onSpeedDisabled);
  });
}
