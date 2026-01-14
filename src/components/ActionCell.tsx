/**
 * ActionCell component for table row actions
 */

import { MoreVertical } from '../icons';

import { Button } from '../primitives/Button';
import { DropdownMenu } from '../primitives/DropdownMenu';
import { getLink, getOnActionHover, getOnActionUnhover } from '../registry';
import { LinkAction, TableAction } from '../types';

interface ActionCellProps<T, K> {
  item: T;
  actions: TableAction<T, K>[];
  onAction: (action: TableAction<T, K>, item: T) => void;
}

export function ActionCell<T, K>({ item, actions, onAction }: ActionCellProps<T, K>) {
  const Link = getLink();

  const handleMouseEnter = (label: string, element: HTMLElement) => {
    getOnActionHover()?.({ label, element });
  };

  const handleMouseLeave = () => {
    getOnActionUnhover()?.();
  };

  const visibleActions = actions.filter(a => {
    const action = typeof a === 'function' ? a(item) : a;
    return !action.hidden;
  });

  const buttonActions = visibleActions.filter(a => {
    const action = typeof a === 'function' ? a(item) : a;
    return action.display !== 'dropdown';
  });

  const dropdownActions = visibleActions.filter(a => {
    const action = typeof a === 'function' ? a(item) : a;
    return action.display === 'dropdown';
  });

  return (
    <div className="flex gap-2 justify-end items-center">
      {buttonActions.map((a, index) => {
        const action = typeof a === 'function' ? a(item) : a;
        const Icon = action.icon;

        // Link type: render as Link
        if (action.type === 'link') {
          const linkAction = action as LinkAction<T>;
          const href = linkAction.href(item);
          return (
            <Link
              key={`link-${action.label}-${index}`}
              to={href}
              target={linkAction.external ? '_blank' : undefined}
              rel={linkAction.external ? 'noopener noreferrer' : undefined}
              className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 rounded-md ${action.showLabel ? 'px-3' : 'w-8'}`}
              aria-disabled={action.disabled}
              onMouseEnter={e => handleMouseEnter(action.label, e.currentTarget)}
              onMouseLeave={handleMouseLeave}
            >
              <Icon className="h-4 w-4" />
              {action.showLabel && action.label}
            </Link>
          );
        }

        // Other types: render as button
        return (
          <Button
            key={`button-${action.label}-${index}`}
            className={action.showLabel ? 'h-8 px-3' : 'h-8 w-8 p-0'}
            variant={action.variant}
            onClick={() => onAction(action, item)}
            disabled={action.disabled}
            onMouseEnter={e => handleMouseEnter(action.label, e.currentTarget)}
            onMouseLeave={handleMouseLeave}
          >
            <Icon className="h-4 w-4" />
            {action.showLabel && action.label}
          </Button>
        );
      })}

      {dropdownActions.length > 0 && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button className="h-9 w-9 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end">
            {dropdownActions.map((a, index) => {
              const action = typeof a === 'function' ? a(item) : a;
              const Icon = action.icon;

              const variantClasses: Record<string, string> = {
                warning: 'text-amber-600 hover:text-amber-700 focus:text-amber-700',
                danger: 'text-red-600 hover:text-red-700 focus:text-red-700',
                info: 'text-blue-600 hover:text-blue-700 focus:text-blue-700',
                success: 'text-green-600 hover:text-green-700 focus:text-green-700',
              };

              const className = action.variant && variantClasses[action.variant] ? variantClasses[action.variant] : '';

              // Link type: render as Link inside DropdownMenuItem
              if (action.type === 'link') {
                const linkAction = action as LinkAction<T>;
                const href = linkAction.href(item);
                return (
                  <DropdownMenu.Item key={`dropdown-${action.label}-${index}`} asChild disabled={action.disabled}>
                    <Link
                      to={href}
                      target={linkAction.external ? '_blank' : undefined}
                      rel={linkAction.external ? 'noopener noreferrer' : undefined}
                      className={className}
                    >
                      <Icon className={`mr-2 h-4 w-4 ${className}`} />
                      {action.label}
                    </Link>
                  </DropdownMenu.Item>
                );
              }

              return (
                <DropdownMenu.Item
                  key={`dropdown-${action.label}-${index}`}
                  onClick={() => onAction(action, item)}
                  disabled={action.disabled}
                  className={className}
                >
                  <Icon className={`mr-2 h-4 w-4 ${className}`} />
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
