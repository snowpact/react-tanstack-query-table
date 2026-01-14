/**
 * Column visibility configuration component
 */

import { Table } from '@tanstack/react-table';
import { Settings } from '../icons';
import { useMemo, useEffect, useRef } from 'react';

import { Button } from '../primitives/Button';
import { DropdownMenu } from '../primitives/DropdownMenu';
import { useTranslation } from '../registry';
import {
  saveColumnConfiguration,
  loadColumnConfiguration,
  generateColumnConfigurationId,
  deleteColumnConfiguration,
} from '../utils';

export type ColumnConfigurationProps<T extends object> = {
  table: Table<T>;
};

export function ColumnConfiguration<T extends object>({ table }: ColumnConfigurationProps<T>) {
  const { t } = useTranslation();

  const configId = useRef(generateColumnConfigurationId());

  const configurableColumns = useMemo(() => {
    return table.getAllColumns().filter(column => {
      // Exclude columns without headers or with empty headers
      const header = column.columnDef.header;
      if (!header || (typeof header === 'string' && header.trim() === '')) {
        return false;
      }

      // Exclude columns that cannot be hidden
      if (column.columnDef.enableHiding === false) {
        return false;
      }

      return true;
    });
  }, [table]);

  const applyDefaultConfiguration = () => {
    configurableColumns.forEach(column => {
      const defaultHidden = column.columnDef.meta?.defaultHidden;
      const shouldBeVisible = !defaultHidden;
      column.toggleVisibility(shouldBeVisible);
    });
  };

  // Load column configuration from cookies on mount
  useEffect(() => {
    const savedConfig = loadColumnConfiguration(configId.current);
    let hasError = false;
    if (savedConfig) {
      Object.entries(savedConfig).forEach(([columnId, isVisible]) => {
        const column = table.getColumn(columnId);
        if (column) {
          column.toggleVisibility(isVisible);
        } else {
          hasError = true;
        }
      });
      if (hasError) {
        deleteColumnConfiguration(configId.current);
      }
    } else {
      applyDefaultConfiguration();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configId.current, table, configurableColumns]);

  const handleToggleVisibility = (columnId: string, checked: boolean) => {
    const column = table.getColumn(columnId);
    if (column) {
      column.toggleVisibility(checked);

      // Get the updated visibility state after the change
      const updatedVisibility = {
        ...table.getState().columnVisibility,
        [columnId]: checked,
      };
      saveColumnConfiguration(configId.current, updatedVisibility);
    }
  };

  const handleResetColumns = () => {
    // Apply default configuration (based on meta.defaultHidden)
    applyDefaultConfiguration();

    // Save the default configuration to cookies
    const defaultVisibility: Record<string, boolean> = {};
    configurableColumns.forEach(column => {
      const defaultHidden = column.columnDef.meta?.defaultHidden;
      defaultVisibility[column.id] = !defaultHidden;
    });
    saveColumnConfiguration(configId.current, defaultVisibility);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button>
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="w-56">
        <div className="flex items-center gap-2 px-2 py-1.5 text-sm font-semibold">
          <Settings className="h-4 w-4" />
          {t('dataTable.columnsConfiguration')}
        </div>
        <DropdownMenu.Separator />

        <div className="max-h-64 overflow-y-auto">
          {configurableColumns.map(column => {
            const isVisible = column.getIsVisible();
            const header = column.columnDef.header;

            // Extract header text
            let headerText = '';
            if (typeof header === 'string') {
              headerText = header;
            } else if (typeof header === 'function') {
              headerText = column.id;
            } else {
              headerText = column.id;
            }

            return (
              <DropdownMenu.CheckboxItem
                key={column.id}
                checked={isVisible}
                onCheckedChange={checked => handleToggleVisibility(column.id, checked)}
              >
                {headerText}
              </DropdownMenu.CheckboxItem>
            );
          })}
        </div>

        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={handleResetColumns} className="text-xs cursor-pointer">
          {t('dataTable.resetColumns')}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
