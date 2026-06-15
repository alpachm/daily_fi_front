// src/hooks/useAppTranslation.ts — Type-safe wrapper around react-i18next
import { useTranslation } from "react-i18next";

/**
 * Type-safe translation hook.
 *
 * The namespace `"translation"` maps to the `TranslationResources` type
 * (derived from the English JSON file). react-i18next infers all valid
 * keys from the resource type, providing full IDE autocomplete.
 *
 * Usage:
 * ```
 * const { t } = useAppTranslation();
 * t("auth.login.submit")       // ✅ autocompletes
 * t("common.save")             // ✅ autocompletes
 * t("invalid.key")             // ❌ TypeScript error
 * ```
 */
const useAppTranslation = () => {
  return useTranslation<"translation">();
};

export default useAppTranslation;

/**
 * Re-export the TFunction type for cases where the `t` function needs
 * to be passed as a prop or stored in a context.
 */
export type AppTFunction = ReturnType<
  typeof useAppTranslation
>["t"];