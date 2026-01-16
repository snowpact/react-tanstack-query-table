/**
 * Translation Registry
 *
 * Allows consumers to provide their own translation function.
 */

type TranslationFunction = (key: string) => string;

// Default: return the key as-is
let translateFn: TranslationFunction = (key: string) => key;

export const setTranslationFunction = (fn: TranslationFunction) => {
  translateFn = fn;
};

export const getT = () => translateFn;

export const resetTranslationRegistry = () => {
  translateFn = (key: string) => key;
};
