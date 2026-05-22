/**
 * ZIKR | ذِكرٌ - Typography System
 * Arabic-first, elegant, cinematic
 */

export const TYPOGRAPHY = {
  // Font Families
  fonts: {
    arabic: '"Tajawal", "Droid Arabic Kufi", sans-serif',
    english: '"Inter", "Segoe UI", sans-serif',
    mono: '"Fira Code", "Courier New", monospace',
  },

  // Heading Styles
  heading: {
    h1: {
      fontSize: "3.5rem",
      lineHeight: "1.1",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "2.5rem",
      lineHeight: "1.2",
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "1.875rem",
      lineHeight: "1.3",
      fontWeight: 600,
      letterSpacing: "-0.005em",
    },
    h4: {
      fontSize: "1.5rem",
      lineHeight: "1.4",
      fontWeight: 600,
    },
    h5: {
      fontSize: "1.25rem",
      lineHeight: "1.5",
      fontWeight: 600,
    },
    h6: {
      fontSize: "1rem",
      lineHeight: "1.5",
      fontWeight: 600,
    },
  },

  // Body Styles
  body: {
    large: {
      fontSize: "1.125rem",
      lineHeight: "1.75",
      fontWeight: 400,
    },
    base: {
      fontSize: "1rem",
      lineHeight: "1.6",
      fontWeight: 400,
    },
    small: {
      fontSize: "0.875rem",
      lineHeight: "1.5",
      fontWeight: 400,
    },
    xs: {
      fontSize: "0.75rem",
      lineHeight: "1.4",
      fontWeight: 400,
    },
  },

  // Display Styles (for hero sections)
  display: {
    large: {
      fontSize: "4.5rem",
      lineHeight: "1",
      fontWeight: 800,
      letterSpacing: "-0.03em",
    },
    medium: {
      fontSize: "3.75rem",
      lineHeight: "1.05",
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
  },

  // Label Styles
  label: {
    fontSize: "0.875rem",
    lineHeight: "1.5",
    fontWeight: 500,
    letterSpacing: "0.02em",
  },

  // Caption Styles
  caption: {
    fontSize: "0.75rem",
    lineHeight: "1.4",
    fontWeight: 400,
    letterSpacing: "0.01em",
  },
} as const;

/**
 * Tailwind CSS typography configuration
 */
export const tailwindTypography = {
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1.4" }],
    sm: ["0.875rem", { lineHeight: "1.5" }],
    base: ["1rem", { lineHeight: "1.6" }],
    lg: ["1.125rem", { lineHeight: "1.75" }],
    xl: ["1.25rem", { lineHeight: "1.5" }],
    "2xl": ["1.5rem", { lineHeight: "1.4" }],
    "3xl": ["1.875rem", { lineHeight: "1.3" }],
    "4xl": ["2.5rem", { lineHeight: "1.2" }],
    "5xl": ["3.5rem", { lineHeight: "1.1" }],
    "6xl": ["3.75rem", { lineHeight: "1.05" }],
    "7xl": ["4.5rem", { lineHeight: "1" }],
  },
};
