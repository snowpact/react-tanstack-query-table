/**
 * Translation Registry
 *
 * Allows consumers to provide their own translation hook (i18next, next-intl, etc.)
 */

type TranslationFunction = (key: string, options?: Record<string, unknown>) => string;
type TranslationHook = () => { t: TranslationFunction };

let useTranslationHook: TranslationHook = () => ({
  t: (key: string) => key,
});

export const setTranslationHook = (hook: TranslationHook) => {
  useTranslationHook = hook;
};

export const useTranslation = () => useTranslationHook();

export const resetTranslationRegistry = () => {
  useTranslationHook = () => ({ t: (key: string) => key });
};
