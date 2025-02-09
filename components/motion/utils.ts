import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import type {
  TransformationConfig,
  ApplyEffectParams,
} from '@/components/motion/types';

export function getAnimConfigs(configs: readonly GSAPTweenVars[] | undefined) {
  return configs?.map(config => ({
    ...config,
    duration: config.duration ?? 1.6,
    delay: config.delay ?? 0,
    stagger: config.stagger ?? 0.07,
  }));
}

export function applyEffect({
  el,
  configs,
  runBackwards = false,
  duration,
  delay,
  stagger,
}: ApplyEffectParams) {
  getAnimConfigs(configs)?.forEach(config => {
    gsap.to(el, {
      ...config,
      duration: duration ?? config.duration,
      delay: delay ?? config.delay,
      stagger: stagger ?? config.stagger,
      runBackwards,
    });
  });
}

export function getSplitText(el: HTMLElement | HTMLElement[], type: string) {
  if (!el) return null;
  return new SplitText(el, {
    type,
    linesClass: 'lines',
    wordsClass: 'words',
    charsClass: 'chars',
  });
}

export function Masking(lines: Element[]) {
  gsap.utils.toArray<Element>(lines).forEach(line => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('masking-text');
    line.parentNode?.insertBefore(wrapper, line);
    wrapper.appendChild(line);
  });
}

export function mapRange(config: TransformationConfig, value: number): number {
  return gsap.utils.mapRange(
    config.start,
    config.end,
    config.from,
    config.to,
    value,
  );
}

export function applyClamp(
  config: TransformationConfig,
  value: number,
): number {
  return gsap.utils.clamp(config.from, config.to, mapRange(config, value));
}
