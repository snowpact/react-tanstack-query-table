import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useIsMobile } from './useIsMobile';

import { renderHookWithProviders } from '../test/test-utils';

describe('useIsMobile', () => {
  let originalInnerWidth: number;
  let matchMediaListeners: Map<string, Set<() => void>>;
  let currentMatches: boolean;

  beforeEach(() => {
    // Store original values
    originalInnerWidth = window.innerWidth;
    matchMediaListeners = new Map();
    currentMatches = false;

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => {
        if (!matchMediaListeners.has(query)) {
          matchMediaListeners.set(query, new Set());
        }
        return {
          matches: currentMatches,
          media: query,
          onchange: null,
          addListener: vi.fn(), // deprecated
          removeListener: vi.fn(), // deprecated
          addEventListener: vi.fn((_event: string, listener: () => void) => {
            matchMediaListeners.get(query)?.add(listener);
          }),
          removeEventListener: vi.fn((_event: string, listener: () => void) => {
            matchMediaListeners.get(query)?.delete(listener);
          }),
          dispatchEvent: vi.fn(),
        };
      }),
    });
  });

  afterEach(() => {
    // Restore original values
    Object.defineProperty(window, 'innerWidth', {
      value: originalInnerWidth,
      writable: true,
      configurable: true,
    });
    vi.restoreAllMocks();
  });

  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      value: width,
      writable: true,
      configurable: true,
    });
  };

  it('should return false for desktop viewport', () => {
    setWindowWidth(1024);

    const { result } = renderHookWithProviders(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it('should return true for mobile viewport', () => {
    setWindowWidth(375);

    const { result } = renderHookWithProviders(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('should return false for viewport at breakpoint', () => {
    setWindowWidth(768);

    const { result } = renderHookWithProviders(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it('should return true for viewport just below breakpoint', () => {
    setWindowWidth(767);

    const { result } = renderHookWithProviders(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('should add event listener on mount', () => {
    setWindowWidth(1024);

    renderHookWithProviders(() => useIsMobile());

    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 767px)');
  });

  it('should update when window is resized', async () => {
    setWindowWidth(1024);

    const { result, rerender } = renderHookWithProviders(() => useIsMobile());

    expect(result.current).toBe(false);

    // Simulate resize to mobile
    setWindowWidth(375);

    // Trigger change event
    act(() => {
      matchMediaListeners.forEach(listeners => {
        listeners.forEach(listener => listener());
      });
    });

    rerender();

    expect(result.current).toBe(true);
  });

  it('should clean up event listener on unmount', () => {
    setWindowWidth(1024);

    // Capture the removeEventListener spy before rendering
    const removeEventListenerSpy = vi.fn();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: currentMatches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((_event: string, listener: () => void) => {
          if (!matchMediaListeners.has(query)) {
            matchMediaListeners.set(query, new Set());
          }
          matchMediaListeners.get(query)?.add(listener);
        }),
        removeEventListener: removeEventListenerSpy,
        dispatchEvent: vi.fn(),
      })),
    });

    const { unmount } = renderHookWithProviders(() => useIsMobile());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalled();
  });

  it('should handle initial undefined state', () => {
    setWindowWidth(1024);

    // The hook starts with undefined and then updates
    const { result } = renderHookWithProviders(() => useIsMobile());

    // Should return false (coerced from undefined via !!)
    expect(typeof result.current).toBe('boolean');
  });
});
