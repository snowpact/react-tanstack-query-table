/**
 * SnowTable Registry
 *
 * Central setup function for configuring SnowTable with consumer-provided dependencies.
 */

import type { ComponentType } from 'react';

import { registerLinkComponent, resetLinkRegistry, type LinkProps } from './linkRegistry';
import { setTranslationFunction, setTranslations, resetTranslationRegistry } from './translationRegistry';

export interface SetupSnowTableOptions {
  /**
   * Translation function (required)
   * Used for all text in the table (column labels, UI elements, etc.)
   * For static UI keys (dataTable.*), if your function returns the key unchanged,
   * built-in English defaults are used as fallback.
   */
  translate: (key: string) => string;

  /**
   * Custom translations to merge with defaults (optional)
   * Useful for simple overrides without a full i18n setup
   */
  translations?: Partial<{
    'dataTable.search': string;
    'dataTable.elements': string;
    'dataTable.paginationSize': string;
    'dataTable.columnsConfiguration': string;
    'dataTable.resetFilters': string;
    'dataTable.resetColumns': string;
    'dataTable.searchFilters': string;
    'dataTable.searchEmpty': string;
    'dataTable.selectFilter': string;
  }>;

  /**
   * Link component for navigation (required for actions with href)
   * Use your router's Link component (react-router, next/link, etc.)
   */
  LinkComponent: ComponentType<LinkProps>;
}

let isSetup = false;

export const setupSnowTable = (options: SetupSnowTableOptions) => {
  if (isSetup) return;

  // Set translation function (required)
  setTranslationFunction(options.translate);

  // Merge custom translations if provided (for static keys only)
  if (options.translations) {
    setTranslations(options.translations);
  }

  registerLinkComponent(options.LinkComponent);

  isSetup = true;
};

export const resetSnowTable = () => {
  isSetup = false;
  resetTranslationRegistry();
  resetLinkRegistry();
};

export const isSnowTableSetup = () => isSetup;

// Re-export everything needed
export { getT, getTranslationKeys } from './translationRegistry';
export { getLink, type LinkProps } from './linkRegistry';
