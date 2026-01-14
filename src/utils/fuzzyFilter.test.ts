import { describe, expect, it, vi } from 'vitest';

import { fuzzyFilter } from './fuzzyFilter';

// Mock row object that mimics TanStack Table Row
const createMockRow = (value: unknown) => ({
  getValue: vi.fn().mockReturnValue(value),
});

describe('fuzzyFilter', () => {
  describe('basic matching', () => {
    it('should match exact string', () => {
      const row = createMockRow('hello');
      const addMeta = vi.fn();

      const result = fuzzyFilter(row as never, 'name', 'hello', addMeta);

      expect(result).toBe(true);
      expect(addMeta).toHaveBeenCalledWith(expect.objectContaining({ itemRank: expect.any(Object) }));
    });

    it('should match partial string', () => {
      const row = createMockRow('hello world');
      const addMeta = vi.fn();

      const result = fuzzyFilter(row as never, 'name', 'hello', addMeta);

      expect(result).toBe(true);
    });

    it('should match case-insensitively', () => {
      const row = createMockRow('Hello World');
      const addMeta = vi.fn();

      const result = fuzzyFilter(row as never, 'name', 'hello', addMeta);

      expect(result).toBe(true);
    });

    it('should not match unrelated string', () => {
      const row = createMockRow('hello');
      const addMeta = vi.fn();

      const result = fuzzyFilter(row as never, 'name', 'xyz', addMeta);

      expect(result).toBe(false);
    });

    it('should match empty filter (return all)', () => {
      const row = createMockRow('hello');
      const addMeta = vi.fn();

      const result = fuzzyFilter(row as never, 'name', '', addMeta);

      expect(result).toBe(true);
    });
  });

  describe('fuzzy matching', () => {
    it('should match fuzzy pattern', () => {
      const row = createMockRow('John Doe');
      const addMeta = vi.fn();

      const result = fuzzyFilter(row as never, 'name', 'jhn', addMeta);

      expect(result).toBe(true);
    });

    it('should match word beginning', () => {
      const row = createMockRow('React Table');
      const addMeta = vi.fn();

      const result = fuzzyFilter(row as never, 'name', 'react', addMeta);

      expect(result).toBe(true);
    });

    it('should match second word', () => {
      const row = createMockRow('React Table');
      const addMeta = vi.fn();

      const result = fuzzyFilter(row as never, 'name', 'table', addMeta);

      expect(result).toBe(true);
    });
  });

  describe('metadata', () => {
    it('should call addMeta with itemRank', () => {
      const row = createMockRow('test');
      const addMeta = vi.fn();

      fuzzyFilter(row as never, 'name', 'test', addMeta);

      expect(addMeta).toHaveBeenCalledTimes(1);
      expect(addMeta).toHaveBeenCalledWith({
        itemRank: expect.objectContaining({
          passed: expect.any(Boolean),
        }),
      });
    });
  });

  describe('different value types', () => {
    it('should handle number values', () => {
      const row = createMockRow(12345);
      const addMeta = vi.fn();

      const result = fuzzyFilter(row as never, 'id', '123', addMeta);

      expect(result).toBe(true);
    });

    it('should handle null values', () => {
      const row = createMockRow(null);
      const addMeta = vi.fn();

      const result = fuzzyFilter(row as never, 'name', 'test', addMeta);

      expect(result).toBe(false);
    });

    it('should handle undefined values', () => {
      const row = createMockRow(undefined);
      const addMeta = vi.fn();

      const result = fuzzyFilter(row as never, 'name', 'test', addMeta);

      expect(result).toBe(false);
    });
  });

  describe('column id usage', () => {
    it('should use columnId to get value from row', () => {
      const getValue = vi.fn().mockReturnValue('test');
      const row = { getValue };
      const addMeta = vi.fn();

      fuzzyFilter(row as never, 'myColumn', 'test', addMeta);

      expect(getValue).toHaveBeenCalledWith('myColumn');
    });
  });
});
