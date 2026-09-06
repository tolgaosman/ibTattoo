// Shared easing + transition presets. Keep durations short and honest —
// see .agents/skills/emil-design-eng: entering/exiting → ease-out, on-screen
// movement → ease-in-out, hover/color → ease.

export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const pageTransitionSpec = {
  duration: 0.32,
  ease: EASE_OUT,
};

export const revealTransition = {
  duration: 0.6,
  ease: EASE_OUT,
};
