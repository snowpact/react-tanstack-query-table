/**
 * Class name merger (clsx-like functionality)
 * Supports strings, booleans, undefined, null, objects, and arrays
 */

type ClassValue = string | boolean | undefined | null | Record<string, boolean | undefined> | ClassValue[];

export function cn(...classes: ClassValue[]): string {
  const result: string[] = [];

  const processClass = (cls: ClassValue) => {
    if (!cls) return;

    if (typeof cls === 'string') {
      result.push(cls);
    } else if (Array.isArray(cls)) {
      for (const item of cls) {
        processClass(item);
      }
    } else if (typeof cls === 'object') {
      for (const [key, value] of Object.entries(cls)) {
        if (value) result.push(key);
      }
    }
  };

  for (const cls of classes) {
    processClass(cls);
  }

  return result.join(' ');
}
