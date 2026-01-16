/**
 * Page size selector component
 */

import { Table } from '@tanstack/react-table';

import { Select } from '../primitives/Select';
import { getT } from '../registry';

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
  const t = getT();

  return (
    <div className="snow-flex snow-items-center snow-gap-2 snow-whitespace-nowrap">
      {enableElementLabel && <span className="snow-text-sm snow-text-muted-foreground">{t('dataTable.paginationSize')}</span>}
      <Select.Root
        value={table.getState().pagination.pageSize.toString()}
        onValueChange={value => {
          table.setPageSize(Number(value));
        }}
      >
        <Select.Trigger className="snow-h-8 snow-w-fit snow-min-w-0">
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
