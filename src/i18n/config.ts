// src/i18n/config.ts — i18next initialization & configuration
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resources from "./resources";
import type { SupportedLanguage } from "./resources";

/**
 * Default language used when the detector cannot determine the user's preference.
 */
const DEFAULT_LANGUAGE: SupportedLanguage = "en";

/**
 * Fallback language used when a translation key is missing in the current language.
 */
const FALLBACK_LANGUAGE: SupportedLanguage = "en";

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: FALLBACK_LANGUAGE,
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "app_language",
    },
  });

  console.log("🌐 Idioma detectado por i18next:", i18next.language);
console.log("📦 Idioma guardado en localStorage:", localStorage.getItem("app_language"));
console.log("🌍 Idioma del navegador:", navigator.language);

export { DEFAULT_LANGUAGE, FALLBACK_LANGUAGE };
export default i18next;