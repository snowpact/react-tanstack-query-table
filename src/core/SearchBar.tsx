/**
 * Search bar component with debounce
 */

import { Search } from '../icons';
import { useEffect, useState } from 'react';

import { Input } from '../primitives/Input';
import { getStyles } from '../registry';

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
  const styles = getStyles();

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
    <div className="relative lg:min-w-[331px] min-w-[220px]">
      <div className="flex relative">
        <Input
          data-testid="data-table-search-bar"
          type="text"
          onChange={e => setInputValue(e.target.value)}
          value={inputValue}
          placeholder={placeholder}
          isActive={hasContent}
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
          <Search className={`w-5 h-5 ${hasContent ? styles.state.activeText : 'text-muted-foreground'}`} />
        </span>
      </div>
    </div>
  );
}
