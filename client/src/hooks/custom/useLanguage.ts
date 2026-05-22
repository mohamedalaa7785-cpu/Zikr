import { useState, useEffect, useCallback } from "react";
import {
  SupportedLanguage,
  DEFAULT_LANGUAGE,
  getCurrentLanguage,
  setLanguage as setLanguageConfig,
  getLanguageDirection,
  LANGUAGE_NAMES,
} from "@/lib/i18n/config";

export function useLanguage() {
  const [language, setLanguageState] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize language on mount
  useEffect(() => {
    const currentLang = getCurrentLanguage();
    setLanguageState(currentLang);
    setLanguageConfig(currentLang);
    setIsLoaded(true);
  }, []);

  // Set language
  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    setLanguageConfig(lang);
  }, []);

  return {
    language,
    setLanguage,
    direction: getLanguageDirection(language),
    languageName: LANGUAGE_NAMES[language],
    isLoaded,
  };
}
