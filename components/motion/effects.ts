export interface Effect {
  init?: GSAPTweenVars;
  in: {
    to?: ReadonlyArray<GSAPTweenVars>;
    from?: ReadonlyArray<GSAPTweenVars>;
    fromTo?: Array<{ from: GSAPTweenVars; to: GSAPTweenVars }>;
  };
  out?: {
    to?: ReadonlyArray<GSAPTweenVars>;
    from?: ReadonlyArray<GSAPTweenVars>;
    fromTo?: Array<{ from: GSAPTweenVars; to: GSAPTweenVars }>;
  };
}
export const effects = {
  letters: {
    splitType: 'chars',
    init: {
      autoAlpha: 0,
    },
    in: {
      to: [
        {
          autoAlpha: 1,
          duration: 0.5,
          stagger: 0.01,
        },
      ],
    },
    out: {
      to: [
        {
          autoAlpha: 0,
          duration: 0.3,
          stagger: 0.01,
        },
      ],
    },
  },
  randomLetters: {
    splitType: 'words',
    init: {
      autoAlpha: 0,
    },
    in: {
      to: [
        {
          autoAlpha: 1,
          duration: 3,
          stagger: {
            from: 'random',
            amount: 0.3,
          },
        },
      ],
    },
    out: {
      to: [
        {
          autoAlpha: 0,
          duration: 0.7,
          stagger: {
            from: 'random',
            ease: 'power2.out',
            amount: 0.4,
          },
        },
      ],
    },
  },
  revealLines: {
    init: {
      autoAlpha: 0.2,
      yPercent: 70,
    },
    in: {
      to: [
        {
          autoAlpha: 1,
          duration: 2,
          stagger: 0.2,
        },
        {
          yPercent: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power1.out',
        },
      ],
    },
  },
} as const;

export type EffectName = keyof typeof effects;
