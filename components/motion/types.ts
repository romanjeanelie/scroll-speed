import type { EffectName, Effect } from './effects';

export interface AnimationType {
  delay?: number;
  duration?: number;
  stagger?: number;
  threshold?: number;
  trigger?: boolean;
}

export interface AnimationCSSType extends AnimationType {
  effect: string;
}

export interface AnimationSplitTextType extends AnimationType {
  effect: EffectName;
}

export interface UseAnimationCSSType extends Omit<AnimationType, 'trigger'> {
  effect: string;
  trigger: (() => boolean | undefined) | undefined;
}

export interface UseAnimationSplitTextType
  extends Effect,
    Omit<AnimationType, 'trigger'> {
  splitType?: 'lines' | 'words' | 'chars';
  trigger: (() => boolean | undefined) | undefined;
}

// Image
export interface ParallaxTrigger {
  start: string;
  end: string;
}

export type ParallaxOptions = {
  innerElement?: boolean;
  speed?: number;
  trigger?: ParallaxTrigger;
};

export type TransformationConfig = {
  from: number;
  to: number;
  start: number;
  end: number;
};

export type ApplyEffectParams = {
  el: Element | Element[];
  configs: readonly GSAPTweenVars[];
  runBackwards?: boolean;
  duration?: number;
  delay?: number;
  stagger?: number;
};
