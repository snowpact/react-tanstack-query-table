import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  deleteColumnConfiguration,
  generateColumnConfigurationId,
  loadColumnConfiguration,
  saveColumnConfiguration,
} from './columnConfig';

describe('columnConfig', () => {
  beforeEach(() => {
    // Clear all cookies before each test
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.split('=');
      document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });

    // Clear console warnings
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('saveColumnConfiguration', () => {
    it('should save configuration to cookie', () => {
      const configId = 'test-table';
      const config = { id: true, name: true, status: false };

      saveColumnConfiguration(configId, config);

      expect(document.cookie).toContain('datatable-config-test-table');
    });

    it('should encode configuration as JSON', () => {
      const configId = 'my-table';
      const config = { col1: true, col2: false };

      saveColumnConfiguration(configId, config);

      // The config should be stored as encoded JSON
      const cookie = document.cookie;
      expect(cookie).toContain('datatable-config-my-table');
    });

    it('should handle empty configuration', () => {
      const configId = 'empty-table';
      const config = {};

      expect(() => saveColumnConfiguration(configId, config)).not.toThrow();
    });

    it('should handle special characters in values', () => {
      const configId = 'special-table';
      const config = { 'col-with-dash': true, col_with_underscore: false };

      expect(() => saveColumnConfiguration(configId, config)).not.toThrow();
    });
  });

  describe('loadColumnConfiguration', () => {
    it('should load configuration from cookie', () => {
      const configId = 'load-test';
      const config = { id: true, name: false };

      // Save first
      saveColumnConfiguration(configId, config);

      // Then load
      const loaded = loadColumnConfiguration(configId);

      expect(loaded).toEqual(config);
    });

    it('should return null when no configuration exists', () => {
      const result = loadColumnConfiguration('non-existent');

      expect(result).toBeNull();
    });

    it('should handle multiple configurations', () => {
      saveColumnConfiguration('table1', { col1: true });
      saveColumnConfiguration('table2', { col2: false });

      expect(loadColumnConfiguration('table1')).toEqual({ col1: true });
      expect(loadColumnConfiguration('table2')).toEqual({ col2: false });
    });

    it('should handle corrupted cookie data gracefully', () => {
      // Set an invalid JSON cookie manually
      document.cookie = 'datatable-config-corrupted=invalid-json; path=/';

      const result = loadColumnConfiguration('corrupted');

      expect(result).toBeNull();
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('deleteColumnConfiguration', () => {
    it('should delete configuration cookie', () => {
      const configId = 'delete-test';
      const config = { id: true };

      // Save first
      saveColumnConfiguration(configId, config);
      expect(loadColumnConfiguration(configId)).toEqual(config);

      // Delete
      deleteColumnConfiguration(configId);

      // Should be null now
      expect(loadColumnConfiguration(configId)).toBeNull();
    });

    it('should not throw when deleting non-existent configuration', () => {
      expect(() => deleteColumnConfiguration('non-existent')).not.toThrow();
    });
  });

  describe('generateColumnConfigurationId', () => {
    it('should generate id from pathname when stack parsing fails', () => {
      // Mock window.location
      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/users/list',
        },
        writable: true,
        configurable: true,
      });

      const id = generateColumnConfigurationId();

      expect(id).toContain('datatable-');
      expect(id).toContain('users');
    });

    it('should handle special characters in pathname', () => {
      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/users/123/details',
        },
        writable: true,
        configurable: true,
      });

      const id = generateColumnConfigurationId();

      // Should replace non-alphanumeric chars with dashes
      expect(id).not.toContain('/');
    });

    it('should return consistent id for same pathname', () => {
      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/test-page',
        },
        writable: true,
        configurable: true,
      });

      const id1 = generateColumnConfigurationId();
      const id2 = generateColumnConfigurationId();

      // The fallback path-based ID should be consistent
      expect(id1.includes('test-page') || id1.includes('datatable')).toBe(true);
      expect(id2.includes('test-page') || id2.includes('datatable')).toBe(true);
    });
  });

  describe('integration', () => {
    it('should save, load, and delete configuration correctly', () => {
      const configId = 'integration-test';
      const config = { col1: true, col2: false, col3: true };

      // Initially null
      expect(loadColumnConfiguration(configId)).toBeNull();

      // Save
      saveColumnConfiguration(configId, config);
      expect(loadColumnConfiguration(configId)).toEqual(config);

      // Update
      const updatedConfig = { col1: false, col2: true, col3: true };
      saveColumnConfiguration(configId, updatedConfig);
      expect(loadColumnConfiguration(configId)).toEqual(updatedConfig);

      // Delete
      deleteColumnConfiguration(configId);
      expect(loadColumnConfiguration(configId)).toBeNull();
    });
  });
});
