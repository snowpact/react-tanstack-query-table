/**
 * Single filter dropdown with multi-select support
 */

import { ChevronDown, Filter, Search } from '../icons';
import { useState, useMemo } from 'react';

import { Button } from '../primitives/Button';
import { DropdownMenu } from '../primitives/DropdownMenu';
import { Input } from '../primitives/Input';
import { getStyles, useTranslation } from '../registry';

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterConfig<T extends object> = {
  key: keyof T;
  label: string;
  options: FilterOption[];
  multipleSelection?: boolean;
};

export interface SingleFilterDropdownProps<T extends object> {
  filter: FilterConfig<T>;
  selectedValues?: string[];
  onFilterChange: (key: keyof T, selectedValues: string[]) => void;
}

export function SingleFilterDropdown<T extends object>({
  filter,
  selectedValues = [],
  onFilterChange,
}: SingleFilterDropdownProps<T>) {
  const { t } = useTranslation();
  const styles = getStyles();

  const [searchTerm, setSearchTerm] = useState('');

  const activeCount = selectedValues.length;

  // Get the labels of selected values (must be before early return for React Hook rules)
  const selectedLabels = useMemo(() => {
    return selectedValues
      .map(value => filter.options.find(opt => opt.value === value)?.label)
      .filter(Boolean) as string[];
  }, [selectedValues, filter.options]);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return filter.options;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return filter.options.filter(
      option =>
        option.label.toLowerCase().includes(lowerSearchTerm) || option.value.toLowerCase().includes(lowerSearchTerm)
    );
  }, [filter.options, searchTerm]);

  const handleOptionToggle = (optionValue: string) => {
    const isCurrentlySelected = selectedValues.includes(optionValue);
    const multipleSelection = filter.multipleSelection ?? false;

    let newValues: string[];

    if (multipleSelection) {
      if (isCurrentlySelected) {
        newValues = selectedValues.filter(v => v !== optionValue);
      } else {
        newValues = [...selectedValues, optionValue];
      }
    } else {
      if (isCurrentlySelected) {
        newValues = [];
      } else {
        newValues = [optionValue];
      }
    }

    onFilterChange(filter.key, newValues);
  };

  const handleReset = () => {
    onFilterChange(filter.key, []);
  };

  if (filter.options.length === 0) return null;

  // Build display text for selected filters
  const getDisplayText = () => {
    if (activeCount === 0) return filter.label;
    if (activeCount === 1) return selectedLabels[0];
    if (activeCount === 2) return selectedLabels.join(', ');
    return `${selectedLabels.slice(0, 2).join(', ')} +${activeCount - 2}`;
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button className={`gap-1.5 w-full justify-between ${activeCount > 0 ? styles.state.active : ''}`}>
          <div className="flex items-center gap-1.5 min-w-0">
            <Filter className={`h-4 w-4 shrink-0 ${activeCount > 0 ? styles.state.activeText : ''}`} />
            <span className="truncate">{getDisplayText()}</span>
          </div>
          <ChevronDown className="h-3.5 w-3.5 opacity-50 shrink-0" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start" className="w-56">
        {/* Search bar */}
        <div className="p-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('dataTable.searchFilters')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => {
                if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete') {
                  e.stopPropagation();
                }
              }}
              className="pl-8 h-8"
            />
          </div>
        </div>

        {filteredOptions.length === 0 ? (
          <div className="px-2 py-4 text-sm text-muted-foreground text-center">{t('dataTable.searchEmpty')}</div>
        ) : (
          filteredOptions.map(option => (
            <DropdownMenu.CheckboxItem
              key={option.value}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={() => handleOptionToggle(option.value)}
              className="cursor-pointer"
            >
              {option.label}
            </DropdownMenu.CheckboxItem>
          ))
        )}

        {activeCount > 0 && (
          <>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onClick={handleReset} className="text-xs cursor-pointer">
              {t('dataTable.resetFilters')}
            </DropdownMenu.Item>
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
