/**
 * Confirm Registry
 *
 * Allows consumers to provide their own confirm dialog function.
 * Content is always a function that receives { close, confirm } helpers.
 */

import type { ReactNode } from 'react';

export interface ConfirmHelpers {
  close: () => void; // Close + resolve false (cancel)
  confirm: () => void; // Close + resolve true (confirm)
}

export type ConfirmContent = (helpers: ConfirmHelpers) => ReactNode;

export interface ConfirmOptions {
  title: string;
  subtitle?: string;
  content: ConfirmContent;
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
