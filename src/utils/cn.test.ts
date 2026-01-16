import { describe, expect, it } from 'vitest';

import { cn } from './cn';

describe('cn (class name merger with snow- prefix)', () => {
  describe('basic functionality', () => {
    it('should merge simple strings and add snow- prefix', () => {
      expect(cn('foo', 'bar')).toBe('snow-foo snow-bar');
    });

    it('should filter out falsy values', () => {
      expect(cn('foo', false, 'bar', null, undefined, 'baz')).toBe('snow-foo snow-bar snow-baz');
    });

    it('should handle empty call', () => {
      expect(cn()).toBe('');
    });

    it('should handle single string', () => {
      expect(cn('foo')).toBe('snow-foo');
    });
  });

  describe('object syntax', () => {
    it('should include keys with truthy values', () => {
      expect(cn({ foo: true, bar: false, baz: true })).toBe('snow-foo snow-baz');
    });

    it('should handle mixed strings and objects', () => {
      expect(cn('base', { active: true, disabled: false })).toBe('snow-base snow-active');
    });

    it('should handle undefined values in objects', () => {
      expect(cn({ foo: true, bar: undefined, baz: true })).toBe('snow-foo snow-baz');
    });
  });

  describe('array syntax', () => {
    it('should flatten arrays', () => {
      expect(cn(['foo', 'bar'], 'baz')).toBe('snow-foo snow-bar snow-baz');
    });

    it('should handle nested arrays', () => {
      expect(cn(['foo', ['bar', 'baz']])).toBe('snow-foo snow-bar snow-baz');
    });

    it('should filter falsy values in arrays', () => {
      expect(cn(['foo', false, 'bar', null])).toBe('snow-foo snow-bar');
    });

    it('should handle arrays with objects', () => {
      expect(cn(['foo', { bar: true, baz: false }])).toBe('snow-foo snow-bar');
    });
  });

  describe('complex combinations', () => {
    it('should handle all types together', () => {
      expect(cn('base', ['variant', { active: true }], { disabled: false }, null, 'extra')).toBe(
        'snow-base snow-variant snow-active snow-extra'
      );
    });

    it('should handle empty arrays', () => {
      expect(cn('foo', [], 'bar')).toBe('snow-foo snow-bar');
    });

    it('should handle empty objects', () => {
      expect(cn('foo', {}, 'bar')).toBe('snow-foo snow-bar');
    });
  });

  describe('real-world use cases', () => {
    it('should work for conditional button classes', () => {
      const isActive = true;
      const isDisabled = false;

      expect(
        cn('btn', 'btn-primary', {
          'btn-active': isActive,
          'btn-disabled': isDisabled,
        })
      ).toBe('snow-btn snow-btn-primary snow-btn-active');
    });

    it('should work for responsive styles with modifiers', () => {
      expect(cn(['text-sm', 'md:text-base', 'lg:text-lg'])).toBe(
        'snow-text-sm snow-md:text-base snow-lg:text-lg'
      );
    });
  });

  describe('prefix handling', () => {
    it('should not double-prefix already prefixed classes', () => {
      expect(cn('snow-foo', 'bar')).toBe('snow-foo snow-bar');
    });

    it('should handle important modifier with prefix', () => {
      expect(cn('!snow-foo', 'bar')).toBe('!snow-foo snow-bar');
    });

    it('should handle hover modifiers', () => {
      expect(cn('hover:bg-red-500')).toBe('snow-hover:bg-red-500');
    });

    it('should handle multiple modifiers', () => {
      expect(cn('sm:hover:bg-blue-500')).toBe('snow-sm:hover:bg-blue-500');
    });

    it('should handle data attribute modifiers', () => {
      expect(cn('data-[state=active]:shadow-sm')).toBe('snow-data-[state=active]:shadow-sm');
    });
  });
});
