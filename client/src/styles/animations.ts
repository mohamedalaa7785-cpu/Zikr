/**
 * ZIKR | ذِكرٌ - Animation & Motion System
 * Smooth, spiritual, cinematic
 */

export const ANIMATIONS = {
  // Durations (in milliseconds)
  duration: {
    fast: 150,
    base: 300,
    slow: 500,
    slower: 700,
    slowest: 1000,
  },

  // Easing functions
  easing: {
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeInCubic: "cubic-bezier(0.32, 0, 0.67, 0)",
    easeOutCubic: "cubic-bezier(0.33, 1, 0.68, 1)",
    easeInQuad: "cubic-bezier(0.11, 0, 0.5, 0)",
    easeOutQuad: "cubic-bezier(0.5, 1, 0.89, 1)",
    spiritual: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  },

  // Preset animations
  preset: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 300 },
    },
    fadeOut: {
      initial: { opacity: 1 },
      animate: { opacity: 0 },
      transition: { duration: 300 },
    },
    slideInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 500 },
    },
    slideInDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 500 },
    },
    slideInLeft: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 500 },
    },
    slideInRight: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 500 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 300 },
    },
    glow: {
      initial: { boxShadow: "0 0 0 rgba(212, 175, 55, 0)" },
      animate: { boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)" },
      transition: { duration: 2, repeat: Infinity, repeatType: "reverse" as const },
    },
  },
} as const;

/**
 * Tailwind CSS animation configuration
 */
export const tailwindAnimations = {
  keyframes: {
    fadeIn: {
      "0%": { opacity: "0" },
      "100%": { opacity: "1" },
    },
    slideInUp: {
      "0%": { transform: "translateY(20px)", opacity: "0" },
      "100%": { transform: "translateY(0)", opacity: "1" },
    },
    slideInDown: {
      "0%": { transform: "translateY(-20px)", opacity: "0" },
      "100%": { transform: "translateY(0)", opacity: "1" },
    },
    slideInLeft: {
      "0%": { transform: "translateX(-20px)", opacity: "0" },
      "100%": { transform: "translateX(0)", opacity: "1" },
    },
    slideInRight: {
      "0%": { transform: "translateX(20px)", opacity: "0" },
      "100%": { transform: "translateX(0)", opacity: "1" },
    },
    scaleIn: {
      "0%": { transform: "scale(0.95)", opacity: "0" },
      "100%": { transform: "scale(1)", opacity: "1" },
    },
    glow: {
      "0%, 100%": { boxShadow: "0 0 0 rgba(212, 175, 55, 0)" },
      "50%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)" },
    },
    pulse: {
      "0%, 100%": { opacity: "1" },
      "50%": { opacity: "0.5" },
    },
  },
  animation: {
    fadeIn: "fadeIn 300ms ease-out",
    slideInUp: "slideInUp 500ms ease-out",
    slideInDown: "slideInDown 500ms ease-out",
    slideInLeft: "slideInLeft 500ms ease-out",
    slideInRight: "slideInRight 500ms ease-out",
    scaleIn: "scaleIn 300ms ease-out",
    glow: "glow 2s ease-in-out infinite",
    pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  },
};
