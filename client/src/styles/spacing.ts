/**
 * ZIKR | ذِكرٌ - Spacing & Layout System
 * Cinematic, responsive, luxurious
 */

export const SPACING = {
  // Base spacing scale (in rem)
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "2.5rem",
  "3xl": "3rem",
  "4xl": "4rem",
  "5xl": "5rem",
  "6xl": "6rem",
  "7xl": "7rem",
  "8xl": "8rem",
} as const;

export const CONTAINER = {
  // Container widths
  xs: "20rem",
  sm: "24rem",
  md: "28rem",
  lg: "32rem",
  xl: "36rem",
  "2xl": "42rem",
  "3xl": "48rem",
  "4xl": "56rem",
  "5xl": "64rem",
  "6xl": "72rem",
  "7xl": "80rem",
} as const;

export const SECTION_PADDING = {
  // Vertical padding for sections
  mobile: "2rem",
  tablet: "3rem",
  desktop: "4rem",
  heroMobile: "3rem",
  heroTablet: "4rem",
  heroDesktop: "6rem",
} as const;

export const BREAKPOINTS = {
  xs: "320px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

/**
 * Cinematic spacing utilities
 */
export const CINEMATIC = {
  // Hero spacing
  heroGap: "3rem",
  heroMargin: "2rem",

  // Card spacing
  cardPadding: "1.5rem",
  cardGap: "1rem",

  // Grid spacing
  gridGap: "1.5rem",
  gridGapLarge: "2.5rem",

  // Vertical rhythm
  rhythmSmall: "1.5rem",
  rhythmMedium: "2.5rem",
  rhythmLarge: "4rem",
} as const;

/**
 * Tailwind CSS spacing configuration
 */
export const tailwindSpacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "2.5rem",
  "3xl": "3rem",
  "4xl": "4rem",
  "5xl": "5rem",
  "6xl": "6rem",
  "7xl": "7rem",
  "8xl": "8rem",
};
