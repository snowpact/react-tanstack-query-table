/**
 * SnowTable Registry
 *
 * Central setup function for configuring SnowTable with consumer-provided dependencies.
 * All UI components are built-in primitives with style customization via the styles registry.
 */

import type { ComponentType } from 'react';

import { setConfirmFunction, resetConfirmRegistry, type ConfirmFunction } from './confirmRegistry';
import { registerLinkComponent, resetLinkRegistry, type LinkProps } from './linkRegistry';
import { registerStyles, resetStylesRegistry, type SnowTableStyles, type DeepPartial } from './stylesRegistry';
import { setTranslationFunction, resetTranslationRegistry } from './translationRegistry';

export interface SetupSnowTableOptions {
  t: (key: string) => string;
  LinkComponent: ComponentType<LinkProps>;
  confirm: ConfirmFunction;
  styles?: DeepPartial<SnowTableStyles>;
}

let isSetup = false;

export const setupSnowTable = (options: SetupSnowTableOptions) => {
  if (isSetup) return;

  setTranslationFunction(options.t);
  registerLinkComponent(options.LinkComponent);
  setConfirmFunction(options.confirm);

  if (options.styles) {
    registerStyles(options.styles);
  }

  isSetup = true;
};

export const resetSnowTable = () => {
  isSetup = false;
  resetTranslationRegistry();
  resetLinkRegistry();
  resetConfirmRegistry();
  resetStylesRegistry();
};

export const isSnowTableSetup = () => isSetup;

// Re-export everything needed
export { getT } from './translationRegistry';
export { getLink, type LinkProps } from './linkRegistry';
export { getConfirm, type ConfirmOptions, type ConfirmContent, type ConfirmCloseHelper, type ConfirmFunction } from './confirmRegistry';
export { getStyles, type SnowTableStyles as TableStyles } from './stylesRegistry';
