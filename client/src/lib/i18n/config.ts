/**
 * Internationalization (i18n) Configuration
 * Supports Arabic (primary) and English (future-ready)
 * Prepared for: Turkish, Urdu, Indonesian
 */

export const SUPPORTED_LANGUAGES = {
  AR: "ar",
  EN: "en",
  TR: "tr",
  UR: "ur",
  ID: "id",
} as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[keyof typeof SUPPORTED_LANGUAGES];

export const DEFAULT_LANGUAGE: SupportedLanguage = SUPPORTED_LANGUAGES.AR;

export const LANGUAGE_NAMES: Record<SupportedLanguage, { name: string; nativeName: string }> = {
  ar: { name: "Arabic", nativeName: "العربية" },
  en: { name: "English", nativeName: "English" },
  tr: { name: "Turkish", nativeName: "Türkçe" },
  ur: { name: "Urdu", nativeName: "اردو" },
  id: { name: "Indonesian", nativeName: "Bahasa Indonesia" },
};

export const RTL_LANGUAGES = [SUPPORTED_LANGUAGES.AR, SUPPORTED_LANGUAGES.UR];
export const LTR_LANGUAGES = [SUPPORTED_LANGUAGES.EN, SUPPORTED_LANGUAGES.TR, SUPPORTED_LANGUAGES.ID];

export const isRTL = (lang: SupportedLanguage): boolean => RTL_LANGUAGES.includes(lang as any);
export const isLTR = (lang: SupportedLanguage): boolean => LTR_LANGUAGES.includes(lang as any);

export const getLanguageDirection = (lang: SupportedLanguage): "rtl" | "ltr" => {
  return isRTL(lang) ? "rtl" : "ltr";
};

/**
 * Get current language from localStorage or browser
 */
export const getCurrentLanguage = (): SupportedLanguage => {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  const stored = localStorage.getItem("language");
  if (stored && Object.values(SUPPORTED_LANGUAGES).includes(stored as SupportedLanguage)) {
    return stored as SupportedLanguage;
  }

  const browserLang = navigator.language?.split("-")[0];
  if (browserLang && Object.values(SUPPORTED_LANGUAGES).includes(browserLang as SupportedLanguage)) {
    return browserLang as SupportedLanguage;
  }

  return DEFAULT_LANGUAGE;
};

/**
 * Set language in localStorage
 */
export const setLanguage = (lang: SupportedLanguage): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = getLanguageDirection(lang);
  }
};
