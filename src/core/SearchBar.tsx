/**
 * Search bar component with debounce
 */

import { Search } from '../icons';
import { useEffect, useState } from 'react';

import { Input } from '../primitives/Input';
import { getStyles } from '../registry';
import { cn } from '../utils';

const SEARCH_DEBOUNCE_MS = 500;

export interface SearchBarProps {
  /** Current value (controlled from parent) */
  value?: string;
  /** Callback with debounced value */
  onDebouncedChange?: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
}

export function SearchBar({ value = '', onDebouncedChange, placeholder }: SearchBarProps) {
  // Internal state for immediate input updates
  const [inputValue, setInputValue] = useState(value);

  // Sync with external value when it changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Debounce: call onDebouncedChange after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== value) {
        onDebouncedChange?.(inputValue);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [inputValue, value, onDebouncedChange]);

  const hasContent = inputValue.length > 0;

  return (
    <div className="snow-searchbar snow-lg:min-w-[331px]">
      <div className="snow-flex snow-relative">
        <Input
          data-testid="data-table-search-bar"
          type="text"
          onChange={e => setInputValue(e.target.value)}
          value={inputValue}
          placeholder={placeholder}
          isActive={hasContent}
          className={getStyles().searchBar || undefined}
        />
        <span className="snow-searchbar-icon">
          <Search className={cn(hasContent ? 'snow-state-active-text' : 'snow-text-muted-foreground')} />
        </span>
      </div>
    </div>
  );
}
