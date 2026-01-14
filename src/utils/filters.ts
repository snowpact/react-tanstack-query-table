/**
 * Utilities for encoding/decoding column filters for URL params
 */

/**
 * Encode column filters into a compact string for URL query params.
 *
 * Format:
 *   key1:v1,v2|key2:v3
 *
 * - keys sans valeurs sont ignorés
 * - valeurs vides sont filtrées
 */
export const encodeFiltersToParam = (filters: Record<string, string[]>): string => {
  const parts: string[] = [];

  for (const [key, values] of Object.entries(filters)) {
    const filteredValues = values.filter(v => v !== '');
    if (!key || filteredValues.length === 0) continue;
    parts.push(`${key}:${filteredValues.join(',')}`);
  }

  return parts.join('|');
};

/**
 * Decode column filters from the compact string format used in URL query params.
 *
 * Inverse de encodeFiltersToParam.
 */
export const decodeFiltersFromParam = (param: string | null | undefined): Record<string, string[]> => {
  if (!param) return {};

  const result: Record<string, string[]> = {};

  const groups = param
    .split('|')
    .map(g => g.trim())
    .filter(Boolean);
  for (const group of groups) {
    const [key, valuesPart] = group.split(':');
    if (!key || !valuesPart) continue;

    const values = valuesPart
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);

    if (values.length > 0) {
      result[key] = values;
    }
  }

  return result;
};
