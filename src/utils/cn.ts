/**
 * Class name merger with tailwind-merge support
 * Supports strings, booleans, undefined, null, objects, and arrays (like clsx)
 */
import { twMerge } from 'tailwind-merge';

type ClassValue = string | boolean | undefined | null | Record<string, boolean | undefined> | ClassValue[];

export function cn(...classes: ClassValue[]): string {
  const result: string[] = [];

  const processClass = (cls: ClassValue) => {
    if (!cls) return;

    if (typeof cls === 'string') {
      result.push(cls);
    } else if (Array.isArray(cls)) {
      // Handle arrays recursively
      for (const item of cls) {
        processClass(item);
      }
    } else if (typeof cls === 'object') {
      // Handle object like { 'class-name': true/false }
      for (const [key, value] of Object.entries(cls)) {
        if (value) result.push(key);
      }
    }
  };

  for (const cls of classes) {
    processClass(cls);
  }

  return twMerge(result.join(' '));
}
