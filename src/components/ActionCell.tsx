/**
 * ActionCell component for table row actions
 * Optimized with React.memo + useMemo + useCallback
 * Tooltips rendered via React Portal (no manual DOM manipulation)
 */

import React, { useState, useCallback, useMemo, memo } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical } from '../icons';
import { Button } from '../primitives/Button';
import { DropdownMenu } from '../primitives/DropdownMenu';
import { getLink } from '../registry';
import { LinkAction, TableAction } from '../types';
import { cn } from '../utils';

interface TooltipState {
  label: string;
  x: number;
  y: number;
}

interface ActionCellProps<T, K> {
  item: T;
  actions: TableAction<T, K>[];
  onAction: (action: TableAction<T, K>, item: T) => void;
}

// Tooltip component rendered via portal
function Tooltip({ label, x, y }: TooltipState) {
  const style: React.CSSProperties = {
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

const variantClasses: Record<string, string> = {
  warning: 'snow-variant-warning',
  danger: 'snow-variant-danger',
  info: 'snow-variant-info',
  success: 'snow-variant-success',
};

function ActionCellInner<T, K>({ item, actions, onAction }: ActionCellProps<T, K>) {
  const Link = getLink();
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const handleMouseEnter = useCallback((label: string, element: HTMLElement) => {
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

    setTooltip({ label, x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  // Memoize action filtering to avoid recalculating on every render
  const { buttonActions, dropdownActions } = useMemo(() => {
    const visible = actions.filter(a => {
      const action = typeof a === 'function' ? a(item) : a;
      return !action.hidden;
    });

    return {
      buttonActions: visible.filter(a => {
        const action = typeof a === 'function' ? a(item) : a;
        return action.display !== 'dropdown';
      }),
      dropdownActions: visible.filter(a => {
        const action = typeof a === 'function' ? a(item) : a;
        return action.display === 'dropdown';
      }),
    };
  }, [actions, item]);

  // Memoize action handler - closes tooltip and calls parent handler
  const handleAction = useCallback(
    (action: TableAction<T, K>) => {
      setTooltip(null);
      onAction(action, item);
    },
    [onAction, item]
  );

  return (
    <div className="snow-action-cell">
      {tooltip && <Tooltip {...tooltip} />}

      {buttonActions.map((a, index) => {
        const action = typeof a === 'function' ? a(item) : a;
        const Icon = action.icon;

        if (action.type === 'link') {
          const linkAction = action as LinkAction<T>;
          const href = linkAction.href(item);
          return (
            <div
              key={`link-${action.label}-${index}`}
              onMouseEnter={e => handleMouseEnter(action.label, e.currentTarget)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to={href}
                target={linkAction.external ? '_blank' : undefined}
                rel={linkAction.external ? 'noopener noreferrer' : undefined}
                className={cn('snow-action-link', action.showLabel ? 'snow-px-3' : 'snow-w-8')}
                disabled={action.disabled}
              >
                <Icon className="snow-size-4" />
                {action.showLabel && action.label}
              </Link>
            </div>
          );
        }

        return (
          <Button
            key={`button-${action.label}-${index}`}
            className={cn(action.showLabel ? '' : 'snow-btn-icon')}
            variant={action.variant}
            onClick={() => handleAction(action)}
            disabled={action.disabled}
            onMouseEnter={e => handleMouseEnter(action.label, e.currentTarget)}
            onMouseLeave={handleMouseLeave}
          >
            <Icon className="snow-size-4" />
            {action.showLabel && action.label}
          </Button>
        );
      })}

      {dropdownActions.length > 0 && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button className="snow-btn-icon-lg">
              <MoreVertical className="snow-size-4" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end">
            {dropdownActions.map((a, index) => {
              const action = typeof a === 'function' ? a(item) : a;
              const Icon = action.icon;

              const variantClass =
                action.variant && variantClasses[action.variant] ? variantClasses[action.variant] : '';

              if (action.type === 'link') {
                const linkAction = action as LinkAction<T>;
                const href = linkAction.href(item);
                return (
                  <DropdownMenu.Item key={`dropdown-${action.label}-${index}`} asChild disabled={action.disabled}>
                    <Link
                      to={href}
                      target={linkAction.external ? '_blank' : undefined}
                      rel={linkAction.external ? 'noopener noreferrer' : undefined}
                      className={variantClass}
                    >
                      <Icon className={cn('snow-mr-2 snow-size-4', variantClass)} />
                      {action.label}
                    </Link>
                  </DropdownMenu.Item>
                );
              }

              return (
                <DropdownMenu.Item
                  key={`dropdown-${action.label}-${index}`}
                  onClick={() => handleAction(action)}
                  disabled={action.disabled}
                  className={variantClass}
                >
                  <Icon className={cn('snow-mr-2 snow-size-4', variantClass)} />
                  {action.label}
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )}
    </div>
  );
}

// Export memoized component - prevents re-render if props are unchanged
export const ActionCell = memo(ActionCellInner) as typeof ActionCellInner;
