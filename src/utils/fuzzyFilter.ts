/**
 * Fuzzy filter for global search
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { rankItem, rankings } from '@tanstack/match-sorter-utils';
import { type FilterFn } from '@tanstack/react-table';

export type SearchMode = 'fuzzy' | 'contains';

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

export const containsFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value, { threshold: rankings.CONTAINS });
  addMeta({ itemRank });
  return itemRank.passed;
};
