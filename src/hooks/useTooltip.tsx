/**
 * Custom hook for tooltip positioning and state management
 * Handles edge detection to prevent tooltip overflow
 */

import { useState, useCallback, useRef, useLayoutEffect, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';

export interface TooltipState {
  label: string;
  x: number;
  y: number;
}

const EDGE_MARGIN = 8;

/** Tooltip component rendered via portal — measures its own width to clamp position */
export function Tooltip({ label, x, y }: TooltipState) {
  const ref = useRef<HTMLDivElement>(null);

  // After the initial render, measure the real tooltip width and adjust
  // position if it would overflow the viewport. Runs before browser paint.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tooltipWidth = el.offsetWidth;
    const maxRight = window.innerWidth - EDGE_MARGIN;
    const minLeft = EDGE_MARGIN;
    let clamped = x;

    if (x + tooltipWidth / 2 > maxRight) {
      clamped = maxRight - tooltipWidth / 2;
    }
    if (x - tooltipWidth / 2 < minLeft) {
      clamped = minLeft + tooltipWidth / 2;
    }

    if (clamped !== x) {
      el.style.left = `${clamped}px`;
    }
  }, [x, label]);

  const style: CSSProperties = {
    position: 'fixed',
    left: x,
    top: y,
    transform: 'translate(-50%, -100%)',
    zIndex: 50,
    pointerEvents: 'none',
  };

  return createPortal(
    <div ref={ref} style={style} className="snow-action-tooltip">
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
    const x = rect.left + rect.width / 2;
    const y = rect.top - 8;
    setState({ label, x, y });
  }, []);

  const hide = useCallback(() => {
    setState(null);
  }, []);

  return { state, show, hide };
}
