import { describe, expect, it } from 'vitest';

import { cn } from './cn';

describe('cn (class name merger)', () => {
  describe('basic functionality', () => {
    it('should merge simple strings', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should filter out falsy values', () => {
      expect(cn('foo', false, 'bar', null, undefined, 'baz')).toBe('foo bar baz');
    });

    it('should handle empty call', () => {
      expect(cn()).toBe('');
    });

    it('should handle single string', () => {
      expect(cn('foo')).toBe('foo');
    });
  });

  describe('object syntax', () => {
    it('should include keys with truthy values', () => {
      expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
    });

    it('should handle mixed strings and objects', () => {
      expect(cn('base', { active: true, disabled: false })).toBe('base active');
    });

    it('should handle undefined values in objects', () => {
      expect(cn({ foo: true, bar: undefined, baz: true })).toBe('foo baz');
    });
  });

  describe('array syntax', () => {
    it('should flatten arrays', () => {
      expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
    });

    it('should handle nested arrays', () => {
      expect(cn(['foo', ['bar', 'baz']])).toBe('foo bar baz');
    });

    it('should filter falsy values in arrays', () => {
      expect(cn(['foo', false, 'bar', null])).toBe('foo bar');
    });

    it('should handle arrays with objects', () => {
      expect(cn(['foo', { bar: true, baz: false }])).toBe('foo bar');
    });
  });

  describe('complex combinations', () => {
    it('should handle all types together', () => {
      expect(cn('base', ['variant', { active: true }], { disabled: false }, null, 'extra')).toBe(
        'base variant active extra'
      );
    });

    it('should handle empty arrays', () => {
      expect(cn('foo', [], 'bar')).toBe('foo bar');
    });

    it('should handle empty objects', () => {
      expect(cn('foo', {}, 'bar')).toBe('foo bar');
    });
  });

  describe('class joining (pure CSS, no Tailwind merge)', () => {
    it('should keep non-conflicting classes', () => {
      expect(cn('flex', 'items-center', 'gap-2')).toBe('flex items-center gap-2');
    });

    it('should keep all classes without merging', () => {
      // Without tailwind-merge, classes are simply joined
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-red-500 text-blue-500');
    });

    it('should keep duplicate-like classes', () => {
      // Without tailwind-merge, all classes are kept
      expect(cn('p-4', 'p-2')).toBe('p-4 p-2');
    });
  });
});
