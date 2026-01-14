/**
 * SnowTable Registry
 *
 * Central setup function for configuring SnowTable with consumer-provided dependencies.
 * All UI components are built-in primitives with style customization via the styles registry.
 */

import type { ComponentType } from 'react';

import { registerActionHover, resetActionHoverRegistry, type ActionHoverInfo } from './actionHoverRegistry';
import { setUseConfirmHook, resetConfirmRegistry, type UseConfirmReturn } from './confirmRegistry';
import { registerLinkComponent, resetLinkRegistry, type LinkProps } from './linkRegistry';
import { registerStyles, resetStylesRegistry, type SnowTableStyles, type DeepPartial } from './stylesRegistry';
import { setTranslationHook, resetTranslationRegistry } from './translationRegistry';

export interface SetupSnowTableOptions {
  useTranslation: () => { t: (key: string, options?: Record<string, unknown>) => string };
  LinkComponent: ComponentType<LinkProps>;
  useConfirm: () => UseConfirmReturn;
  styles?: DeepPartial<SnowTableStyles>;
  onActionHover?: (info: ActionHoverInfo) => void;
  onActionUnhover?: () => void;
}

let isSetup = false;

export const setupSnowTable = (options: SetupSnowTableOptions) => {
  if (isSetup) return;

  setTranslationHook(options.useTranslation);
  registerLinkComponent(options.LinkComponent);
  setUseConfirmHook(options.useConfirm);

  if (options.styles) {
    registerStyles(options.styles);
  }

  if (options.onActionHover || options.onActionUnhover) {
    registerActionHover(options.onActionHover, options.onActionUnhover);
  }

  isSetup = true;
};

export const resetSnowTable = () => {
  isSetup = false;
  resetTranslationRegistry();
  resetLinkRegistry();
  resetConfirmRegistry();
  resetStylesRegistry();
  resetActionHoverRegistry();
};

export const isSnowTableSetup = () => isSetup;

// Re-export everything needed
export { useTranslation } from './translationRegistry';
export { getLink, type LinkProps } from './linkRegistry';
export { useConfirm, type ConfirmOptions, type ConfirmContent, type ConfirmCloseHelper } from './confirmRegistry';
export { getStyles, type SnowTableStyles as TableStyles } from './stylesRegistry';
export { getOnActionHover, getOnActionUnhover, type ActionHoverInfo } from './actionHoverRegistry';
