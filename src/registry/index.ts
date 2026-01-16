/**
 * SnowTable Registry
 *
 * Central setup function for configuring SnowTable with consumer-provided dependencies.
 * All UI components are built-in primitives with style customization via the styles registry.
 */

import type { ComponentType } from 'react';

import { registerLinkComponent, resetLinkRegistry, type LinkProps } from './linkRegistry';
import { registerStyles, resetStylesRegistry, type SnowTableStyles, type DeepPartial } from './stylesRegistry';
import { setTranslationFunction, resetTranslationRegistry } from './translationRegistry';

export interface SetupSnowTableOptions {
  t: (key: string) => string;
  LinkComponent: ComponentType<LinkProps>;
  styles?: DeepPartial<SnowTableStyles>;
}

let isSetup = false;

export const setupSnowTable = (options: SetupSnowTableOptions) => {
  if (isSetup) return;

  setTranslationFunction(options.t);
  registerLinkComponent(options.LinkComponent);

  if (options.styles) {
    registerStyles(options.styles);
  }

  isSetup = true;
};

export const resetSnowTable = () => {
  isSetup = false;
  resetTranslationRegistry();
  resetLinkRegistry();
  resetStylesRegistry();
};

export const isSnowTableSetup = () => isSetup;

// Re-export everything needed
export { getT } from './translationRegistry';
export { getLink, type LinkProps } from './linkRegistry';
export { getStyles, type SnowTableStyles as TableStyles } from './stylesRegistry';
