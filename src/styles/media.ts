const sizes = {
  xs: 320,
  sm: 480,
  ssm: 600,
  md: 768,
  mmd: 800,
  lg: 1024,
  xl: 1280,
  xxl: 1440
};

type Breakpoint = keyof typeof sizes;

export const media = {
  greaterThan: (breakpoint: Breakpoint) =>
    `@media (min-width: ${sizes[breakpoint]}px)`,

  lessThan: (breakpoint: Breakpoint) =>
    `@media (max-width: ${sizes[breakpoint] - 1}px)`,

  between: (min: Breakpoint, max: Breakpoint) =>
    `@media (min-width: ${sizes[min]}px) and (max-width: ${sizes[max] - 1}px)`
};
