import { describe, expect, it } from 'vitest';

import { decodeFiltersFromParam, encodeFiltersToParam } from './filters';

describe('filter utils', () => {
  describe('encodeFiltersToParam', () => {
    it('should encode single filter with single value', () => {
      const filters = { status: ['ACTIVE'] };
      expect(encodeFiltersToParam(filters)).toBe('status:ACTIVE');
    });

    it('should encode single filter with multiple values', () => {
      const filters = { status: ['ACTIVE', 'CLOSED', 'DRAFT'] };
      expect(encodeFiltersToParam(filters)).toBe('status:ACTIVE,CLOSED,DRAFT');
    });

    it('should encode multiple filters', () => {
      const filters = {
        status: ['ACTIVE', 'CLOSED'],
        travelId: ['id1', 'id2'],
      };
      const result = encodeFiltersToParam(filters);
      expect(result).toContain('status:ACTIVE,CLOSED');
      expect(result).toContain('travelId:id1,id2');
      expect(result.split('|')).toHaveLength(2);
    });

    it('should ignore empty values', () => {
      const filters = { status: ['ACTIVE', '', 'CLOSED'] };
      expect(encodeFiltersToParam(filters)).toBe('status:ACTIVE,CLOSED');
    });

    it('should ignore filters with empty arrays', () => {
      const filters = { status: ['ACTIVE'], empty: [] };
      expect(encodeFiltersToParam(filters)).toBe('status:ACTIVE');
    });

    it('should ignore filters with only empty strings', () => {
      const filters = { status: ['ACTIVE'], empty: ['', ''] };
      expect(encodeFiltersToParam(filters)).toBe('status:ACTIVE');
    });

    it('should return empty string for empty filters object', () => {
      expect(encodeFiltersToParam({})).toBe('');
    });
  });

  describe('decodeFiltersFromParam', () => {
    it('should decode single filter with single value', () => {
      const param = 'status:ACTIVE';
      expect(decodeFiltersFromParam(param)).toEqual({ status: ['ACTIVE'] });
    });

    it('should decode single filter with multiple values', () => {
      const param = 'status:ACTIVE,CLOSED,DRAFT';
      expect(decodeFiltersFromParam(param)).toEqual({ status: ['ACTIVE', 'CLOSED', 'DRAFT'] });
    });

    it('should decode multiple filters', () => {
      const param = 'status:ACTIVE,CLOSED|travelId:id1,id2';
      expect(decodeFiltersFromParam(param)).toEqual({
        status: ['ACTIVE', 'CLOSED'],
        travelId: ['id1', 'id2'],
      });
    });

    it('should handle whitespace in values', () => {
      const param = 'status: ACTIVE , CLOSED ';
      expect(decodeFiltersFromParam(param)).toEqual({ status: ['ACTIVE', 'CLOSED'] });
    });

    it('should handle whitespace in groups', () => {
      const param = ' status:ACTIVE | travelId:id1 ';
      expect(decodeFiltersFromParam(param)).toEqual({
        status: ['ACTIVE'],
        travelId: ['id1'],
      });
    });

    it('should ignore empty groups', () => {
      const param = 'status:ACTIVE||travelId:id1';
      expect(decodeFiltersFromParam(param)).toEqual({
        status: ['ACTIVE'],
        travelId: ['id1'],
      });
    });

    it('should ignore invalid groups (missing colon)', () => {
      const param = 'status:ACTIVE|invalid|travelId:id1';
      expect(decodeFiltersFromParam(param)).toEqual({
        status: ['ACTIVE'],
        travelId: ['id1'],
      });
    });

    it('should return empty object for null or undefined', () => {
      expect(decodeFiltersFromParam(null)).toEqual({});
      expect(decodeFiltersFromParam(undefined)).toEqual({});
      expect(decodeFiltersFromParam('')).toEqual({});
    });

    it('should be inverse of encodeFiltersToParam', () => {
      const filters = {
        status: ['ACTIVE', 'CLOSED'],
        travelId: ['id1', 'id2'],
      };
      const encoded = encodeFiltersToParam(filters);
      const decoded = decodeFiltersFromParam(encoded);
      expect(decoded).toEqual(filters);
    });
  });
});
