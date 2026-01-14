/**
 * Confirm Registry
 *
 * Allows consumers to provide their own confirm dialog hook.
 * Supports both static content and render functions with close callback.
 */

import type { ReactNode } from 'react';

export interface ConfirmCloseHelper {
  close: () => void;
}

export type ConfirmContent = ReactNode | ((helpers: ConfirmCloseHelper) => ReactNode);

export interface ConfirmOptions {
  title: string;
  subtitle?: string;
  content: ConfirmContent;
  confirmText?: string;
  cancelText?: string;
  hideButtons?: boolean;
}

export interface UseConfirmReturn {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

type UseConfirmHook = () => UseConfirmReturn;

let useConfirmHook: UseConfirmHook = () => ({
  confirm: async () => true,
});

export const setUseConfirmHook = (hook: UseConfirmHook) => {
  useConfirmHook = hook;
};

export const useConfirm = () => useConfirmHook();

export const resetConfirmRegistry = () => {
  useConfirmHook = () => ({ confirm: async () => true });
};
