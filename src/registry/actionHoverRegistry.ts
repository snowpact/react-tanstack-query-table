/**
 * Action Hover Registry
 *
 * Allows consumers to provide custom tooltip behavior for action buttons.
 * The consumer handles all tooltip UI - SnowTable just notifies on hover/unhover.
 */

export interface ActionHoverInfo {
  label: string;
  element: HTMLElement;
}

type ActionHoverCallback = (info: ActionHoverInfo) => void;
type ActionUnhoverCallback = () => void;

let onActionHover: ActionHoverCallback | undefined;
let onActionUnhover: ActionUnhoverCallback | undefined;

export const registerActionHover = (hover?: ActionHoverCallback, unhover?: ActionUnhoverCallback) => {
  onActionHover = hover;
  onActionUnhover = unhover;
};

export const getOnActionHover = (): ActionHoverCallback | undefined => onActionHover;
export const getOnActionUnhover = (): ActionUnhoverCallback | undefined => onActionUnhover;

export const resetActionHoverRegistry = () => {
  onActionHover = undefined;
  onActionUnhover = undefined;
};
