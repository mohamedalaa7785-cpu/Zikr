/**
 * ZIKR | ذِكرٌ - Premium Islamic Cinematic Color System
 * Spiritual, Luxurious, Calm, Immersive
 */

export const ZIKR_COLORS = {
  // Primary Colors
  primary: {
    deepBlack: "#0a0a0a",
    darkNavy: "#0f1419",
    softGold: "#d4af37",
    goldAccent: "#c9a227",
    goldLight: "#e8d5b7",
  },

  // Secondary Colors
  secondary: {
    beige: "#f5f1e8",
    islamicGreen: "#2d5016",
    greenAccent: "#3a6b1f",
    greenLight: "#5a8c3a",
  },

  // Neutral Palette
  neutral: {
    white: "#ffffff",
    offWhite: "#f9f7f4",
    lightGray: "#e8e6e1",
    mediumGray: "#a8a8a8",
    darkGray: "#4a4a4a",
    charcoal: "#2a2a2a",
  },

  // Semantic Colors
  semantic: {
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },

  // Spiritual Overlays (with transparency)
  spiritual: {
    goldGlow: "rgba(212, 175, 55, 0.15)",
    greenGlow: "rgba(45, 80, 22, 0.1)",
    darkOverlay: "rgba(10, 10, 10, 0.7)",
    lightOverlay: "rgba(255, 255, 255, 0.05)",
  },
} as const;

/**
 * Tailwind CSS color configuration
 */
export const tailwindColors = {
  zikr: {
    black: ZIKR_COLORS.primary.deepBlack,
    navy: ZIKR_COLORS.primary.darkNavy,
    gold: ZIKR_COLORS.primary.softGold,
    "gold-accent": ZIKR_COLORS.primary.goldAccent,
    "gold-light": ZIKR_COLORS.primary.goldLight,
    beige: ZIKR_COLORS.secondary.beige,
    "islamic-green": ZIKR_COLORS.secondary.islamicGreen,
    "green-accent": ZIKR_COLORS.secondary.greenAccent,
    "green-light": ZIKR_COLORS.secondary.greenLight,
  },
};
