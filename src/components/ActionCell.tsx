/**
 * ActionCell component for table row actions
 * Optimized with React.memo + useMemo + useCallback
 * Tooltips rendered via React Portal (no manual DOM manipulation)
 */

import { useCallback, useMemo, memo } from 'react';
import { MoreVertical } from '../icons';
import { useTooltip, Tooltip } from '../hooks/useTooltip';
import { Button } from '../primitives/Button';
import { DropdownMenu } from '../primitives/DropdownMenu';
import { getLink } from '../registry';
import { LinkAction, TableAction } from '../types';
import { cn } from '../utils';


interface ActionCellProps<T, K> {
  item: T;
  actions: TableAction<T, K>[];
  onAction: (action: TableAction<T, K>, item: T) => void;
}

function ActionCellInner<T, K>({ item, actions, onAction }: ActionCellProps<T, K>) {
  const Link = getLink();
  const tooltip = useTooltip();

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
      tooltip.hide();
      onAction(action, item);
    },
    [tooltip, onAction, item]
  );

  return (
    <div className="snow-action-cell">
      {tooltip.state && <Tooltip {...tooltip.state} />}

      {buttonActions.map((a, index) => {
        const action = typeof a === 'function' ? a(item) : a;
        const Icon = action.icon;

        if (action.type === 'link') {
          const linkAction = action as LinkAction<T>;
          const href = linkAction.href(item);
          return (
            <div
              key={`link-${action.label}-${index}`}
              onMouseEnter={e => tooltip.show(action.label, e.currentTarget)}
              onMouseLeave={tooltip.hide}
            >
              <Link
                to={href}
                target={linkAction.external ? '_blank' : undefined}
                rel={linkAction.external ? 'noopener noreferrer' : undefined}
                className={cn('snow-action-link', action.showLabel ? 'snow-px-3' : 'snow-w-8', action.className)}
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
            className={cn('snow-action-btn', action.showLabel ? '' : 'snow-btn-icon', action.className)}
            onClick={() => handleAction(action)}
            disabled={action.disabled}
            onMouseEnter={e => tooltip.show(action.label, e.currentTarget)}
            onMouseLeave={tooltip.hide}
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

              if (action.type === 'link') {
                const linkAction = action as LinkAction<T>;
                const href = linkAction.href(item);
                return (
                  <DropdownMenu.Item key={`dropdown-${action.label}-${index}`} asChild disabled={action.disabled}>
                    <Link
                      to={href}
                      target={linkAction.external ? '_blank' : undefined}
                      rel={linkAction.external ? 'noopener noreferrer' : undefined}
                      className={action.className}
                    >
                      <Icon className="snow-mr-2 snow-size-4" />
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
                  className={action.className}
                >
                  <Icon className="snow-mr-2 snow-size-4" />
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
