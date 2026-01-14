/**
 * Utility for printing values in table cells
 */

const isPrintableValue = (value: unknown): boolean => {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null ||
    value === undefined
  );
};

export const printValue = (value: unknown): string => {
  if (isPrintableValue(value)) {
    return String(value);
  }
  return JSON.stringify(value, null, 2);
};
