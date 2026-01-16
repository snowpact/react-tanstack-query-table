/**
 * Class name merger with tailwind-merge support
 * Supports strings, booleans, undefined, null, objects, and arrays (like clsx)
 * Automatically prefixes Tailwind classes with 'snow-' for isolation
 */
import { extendTailwindMerge } from 'tailwind-merge';

// Configure tailwind-merge to work with our 'snow-' prefix
const twMerge = extendTailwindMerge({
  prefix: 'snow-',
});

type ClassValue = string | boolean | undefined | null | Record<string, boolean | undefined> | ClassValue[];

// Classes that should NOT be prefixed (custom classes, data attributes, etc.)
const SKIP_PREFIX_PATTERNS = [
  /^snow-/, // Already prefixed
  /^!snow-/, // Already prefixed with important
];

/**
 * Add 'snow-' prefix to a single class
 * Prefix is added at the beginning of the entire class (including modifiers)
 * to match how the CSS is prefixed in the build step.
 */
function prefixClass(cls: string): string {
  // Skip if matches any skip pattern (already prefixed)
  if (SKIP_PREFIX_PATTERNS.some(pattern => pattern.test(cls))) {
    return cls;
  }

  // Prefix the entire class (including any modifiers)
  // e.g., "hover:bg-red-500" → "snow-hover:bg-red-500"
  // e.g., "data-[state=active]:shadow-sm" → "snow-data-[state=active]:shadow-sm"
  return `snow-${cls}`;
}

/**
 * Process a class string and prefix all classes
 */
function prefixClasses(classString: string): string {
  return classString
    .split(' ')
    .filter(Boolean)
    .map(prefixClass)
    .join(' ');
}

export function cn(...classes: ClassValue[]): string {
  const result: string[] = [];

  const processClass = (cls: ClassValue) => {
    if (!cls) return;

    if (typeof cls === 'string') {
      result.push(prefixClasses(cls));
    } else if (Array.isArray(cls)) {
      // Handle arrays recursively
      for (const item of cls) {
        processClass(item);
      }
    } else if (typeof cls === 'object') {
      // Handle object like { 'class-name': true/false }
      for (const [key, value] of Object.entries(cls)) {
        if (value) result.push(prefixClasses(key));
      }
    }
  };

  for (const cls of classes) {
    processClass(cls);
  }

  return twMerge(result.join(' '));
}
