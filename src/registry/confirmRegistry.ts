/**
 * Confirm Registry
 *
 * Allows consumers to provide their own confirm dialog function.
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

export type ConfirmFunction = (options: ConfirmOptions) => Promise<boolean>;

// Default: always return true (no confirmation)
let confirmFn: ConfirmFunction = async () => true;

export const setConfirmFunction = (fn: ConfirmFunction) => {
  confirmFn = fn;
};

export const getConfirm = () => confirmFn;

export const resetConfirmRegistry = () => {
  confirmFn = async () => true;
};
