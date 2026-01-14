/**
 * Page size selector component
 */

import { Table } from '@tanstack/react-table';

import { Select } from '../primitives/Select';
import { useTranslation } from '../registry';

import { DEFAULT_PAGE_SIZES } from './Pagination';

export type PageSizeSelectorProps<Data extends object> = {
  table: Table<Data>;
  paginationSizes?: number[];
  enableElementLabel?: boolean;
};

export function PageSizeSelector<Data extends object>({
  table,
  paginationSizes = DEFAULT_PAGE_SIZES,
  enableElementLabel = true,
}: PageSizeSelectorProps<Data>) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      {enableElementLabel && <span className="text-sm text-muted-foreground">{t('dataTable.paginationSize')}</span>}
      <Select.Root
        value={table.getState().pagination.pageSize.toString()}
        onValueChange={value => {
          table.setPageSize(Number(value));
        }}
      >
        <Select.Trigger className="h-8 w-[80px]">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          {paginationSizes.map((pageSize, index) => (
            <Select.Item key={pageSize + index} value={pageSize.toString()}>
              {pageSize}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  );
}
