import { describe, expect, it } from 'vitest';

import { printValue } from './print';

describe('printValue', () => {
  describe('primitive types', () => {
    it('should convert string to string', () => {
      expect(printValue('hello')).toBe('hello');
    });

    it('should convert empty string to string', () => {
      expect(printValue('')).toBe('');
    });

    it('should convert number to string', () => {
      expect(printValue(42)).toBe('42');
    });

    it('should convert zero to string', () => {
      expect(printValue(0)).toBe('0');
    });

    it('should convert negative number to string', () => {
      expect(printValue(-123)).toBe('-123');
    });

    it('should convert float to string', () => {
      expect(printValue(3.14159)).toBe('3.14159');
    });

    it('should convert true to string', () => {
      expect(printValue(true)).toBe('true');
    });

    it('should convert false to string', () => {
      expect(printValue(false)).toBe('false');
    });

    it('should convert null to string', () => {
      expect(printValue(null)).toBe('null');
    });

    it('should convert undefined to string', () => {
      expect(printValue(undefined)).toBe('undefined');
    });
  });

  describe('complex types', () => {
    it('should stringify simple object', () => {
      const obj = { name: 'John', age: 30 };
      const result = printValue(obj);
      expect(result).toBe(JSON.stringify(obj, null, 2));
    });

    it('should stringify empty object', () => {
      expect(printValue({})).toBe('{}');
    });

    it('should stringify array', () => {
      const arr = [1, 2, 3];
      const result = printValue(arr);
      expect(result).toBe(JSON.stringify(arr, null, 2));
    });

    it('should stringify empty array', () => {
      expect(printValue([])).toBe('[]');
    });

    it('should stringify nested object', () => {
      const nested = {
        user: {
          name: 'John',
          address: {
            city: 'Paris',
          },
        },
      };
      const result = printValue(nested);
      expect(result).toBe(JSON.stringify(nested, null, 2));
    });

    it('should stringify array of objects', () => {
      const arr = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];
      const result = printValue(arr);
      expect(result).toBe(JSON.stringify(arr, null, 2));
    });

    it('should stringify Date object', () => {
      const date = new Date('2024-01-15T10:30:00.000Z');
      const result = printValue(date);
      expect(result).toBe(JSON.stringify(date, null, 2));
    });

    it('should handle object with null values', () => {
      const obj = { name: 'John', age: null };
      const result = printValue(obj);
      expect(result).toBe(JSON.stringify(obj, null, 2));
    });

    it('should handle mixed array', () => {
      const arr = [1, 'two', { three: 3 }];
      const result = printValue(arr);
      expect(result).toBe(JSON.stringify(arr, null, 2));
    });
  });

  describe('edge cases', () => {
    it('should handle NaN as string', () => {
      expect(printValue(NaN)).toBe('NaN');
    });

    it('should handle Infinity as string', () => {
      expect(printValue(Infinity)).toBe('Infinity');
    });

    it('should handle negative Infinity as string', () => {
      expect(printValue(-Infinity)).toBe('-Infinity');
    });

    it('should throw on BigInt (not JSON-serializable)', () => {
      // BigInt is not a primitive type we handle specially
      // and it's also not JSON-serializable, so it will throw
      const bigInt = BigInt(9007199254740991);
      expect(() => printValue(bigInt)).toThrow();
    });
  });
});
