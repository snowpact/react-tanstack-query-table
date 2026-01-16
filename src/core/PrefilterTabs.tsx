/**
 * Prefilter tabs component (tabs or select based on viewport/count)
 */

import { Select } from '../primitives/Select';
import { Tabs } from '../primitives/Tabs';
import { getT } from '../registry';
import { useIsMobile } from '../utils';

export type PreFilter = {
  id: string;
  label: string;
};

export interface PrefilterTabsProps {
  prefilters: PreFilter[];
  activePrefilter: string;
  onPrefilterChange: (id: string) => void;
}

export function PrefilterTabs({ prefilters, activePrefilter, onPrefilterChange }: PrefilterTabsProps) {
  const isMobile = useIsMobile();
  const t = getT();

  const activeFilter = prefilters.find(filter => filter.id === activePrefilter);

  // Check if not the first prefilter (indicating a filter is active)
  const isNotDefaultFilter = prefilters.length > 0 && activePrefilter !== prefilters[0]?.id;

  // If mobile or more than 4 filters, use a select dropdown
  if (isMobile || prefilters.length > 4) {
    return (
      <Select.Root value={activePrefilter} onValueChange={onPrefilterChange}>
        <Select.Trigger className={`snow-w-fit snow-min-w-32 ${isNotDefaultFilter ? 'snow-state-active' : ''}`}>
          <Select.Value>{activeFilter?.label || t('dataTable.selectFilter')}</Select.Value>
        </Select.Trigger>
        <Select.Content>
          {prefilters.map(prefilter => (
            <Select.Item key={prefilter.id} value={prefilter.id}>
              {prefilter.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    );
  }

  // Otherwise, use tabs
  return (
    <Tabs.Root value={activePrefilter} onValueChange={onPrefilterChange}>
      <Tabs.List className={isNotDefaultFilter ? 'snow-state-active' : ''}>
        {prefilters.map(prefilter => (
          <Tabs.Trigger key={prefilter.id} value={prefilter.id}>
            {prefilter.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}
