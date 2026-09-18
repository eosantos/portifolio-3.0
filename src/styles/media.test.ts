import { media } from './media';

describe('media utilities', () => {
  const breakpoints = {
    xs: 320,
    sm: 480,
    ssm: 600,
    md: 768,
    mmd: 800,
    lg: 1024,
    xl: 1280,
    xxl: 1440
  };

  describe('greaterThan', () => {
    it('generates correct min-width media query for each breakpoint', () => {
      Object.entries(breakpoints).forEach(([key, value]) => {
        const query = media.greaterThan(key as keyof typeof breakpoints);
        expect(query).toBe(`@media (min-width: ${value}px)`);
      });
    });

    it('returns string with undefined for invalid breakpoint', () => {
      // @ts-expect-error testing invalid input
      const result = media.greaterThan('invalid');
      expect(result).toBe('@media (min-width: undefinedpx)');
    });
  });

  describe('lessThan', () => {
    it('generates correct max-width media query for each breakpoint', () => {
      Object.entries(breakpoints).forEach(([key, value]) => {
        const query = media.lessThan(key as keyof typeof breakpoints);
        expect(query).toBe(`@media (max-width: ${value - 1}px)`);
      });
    });

    it('returns string with NaN for invalid breakpoint', () => {
      // @ts-expect-error testing invalid input
      const result = media.lessThan('invalid');
      expect(result).toBe('@media (max-width: NaNpx)');
    });
  });

  describe('between', () => {
    it('generates correct range media query', () => {
      const query = media.between('md', 'lg');
      expect(query).toBe('@media (min-width: 768px) and (max-width: 1023px)');
    });

    it('handles same min and max', () => {
      const query = media.between('md', 'md');
      expect(query).toBe('@media (min-width: 768px) and (max-width: 767px)');
    });

    it('returns string with undefined/NaN for invalid breakpoints', () => {
      // @ts-expect-error testing invalid input
      expect(media.between('invalid', 'md')).toBe(
        '@media (min-width: undefinedpx) and (max-width: 767px)'
      );
      // @ts-expect-error testing invalid input
      expect(media.between('md', 'invalid')).toBe(
        '@media (min-width: 768px) and (max-width: NaNpx)'
      );
    });
  });
});
