// src/i18n/resources.ts — Type-safe translation resource definitions
import en from "../locales/en.json";
import es from "../locales/es.json";

/**
 * Recursive type that mirrors the JSON structure of our translation files.
 * This enables full IDE autocomplete for all translation keys.
 */
export type TranslationResources = {
  translation: typeof en;
};

/**
 * All supported locales and their corresponding translation resources.
 */
const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
} as const;

export default resources;

/**
 * Union of all supported language codes.
 */
export type SupportedLanguage = keyof typeof resources;