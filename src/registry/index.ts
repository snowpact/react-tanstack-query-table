/**
 * SnowTable Registry
 *
 * Central setup function for configuring SnowTable with consumer-provided dependencies.
 */

import type { ComponentType } from 'react';

import { registerLinkComponent, resetLinkRegistry, type LinkProps } from './linkRegistry';
import { setTranslationFunction, resetTranslationRegistry } from './translationRegistry';

export interface SetupSnowTableOptions {
  t: (key: string) => string;
  LinkComponent: ComponentType<LinkProps>;
}

let isSetup = false;

export const setupSnowTable = (options: SetupSnowTableOptions) => {
  if (isSetup) return;

  setTranslationFunction(options.t);
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
export { getT } from './translationRegistry';
export { getLink, type LinkProps } from './linkRegistry';
