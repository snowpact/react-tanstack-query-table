/**
 * Custom hook for tooltip positioning and state management
 * Handles edge detection to prevent tooltip overflow
 */

import { useState, useCallback, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';

export interface TooltipState {
  label: string;
  x: number;
  y: number;
}

/** Tooltip component rendered via portal */
export function Tooltip({ label, x, y }: TooltipState) {
  const style: CSSProperties = {
    position: 'fixed',
    left: x,
    top: y,
    transform: 'translate(-50%, -100%)',
    zIndex: 50,
    pointerEvents: 'none',
  };

  return createPortal(
    <div style={style} className="snow-action-tooltip">
      <div className="snow-tooltip-content">{label}</div>
      <div className="snow-tooltip-arrow" />
    </div>,
    document.body
  );
}

export function useTooltip() {
  const [state, setState] = useState<TooltipState | null>(null);

  const show = useCallback((label: string, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    let x = rect.left + rect.width / 2;
    const y = rect.top - 8;

    // Prevent overflow on edges
    const maxRight = window.innerWidth - 8;
    const minLeft = 8;
    const approxWidth = label.length * 7 + 16;

    if (x + approxWidth / 2 > maxRight) {
      x = maxRight - approxWidth / 2;
    }
    if (x - approxWidth / 2 < minLeft) {
      x = minLeft + approxWidth / 2;
    }

    setState({ label, x, y });
  }, []);

  const hide = useCallback(() => {
    setState(null);
  }, []);

  return { state, show, hide };
}
