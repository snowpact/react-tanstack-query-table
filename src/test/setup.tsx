import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';

import { setupSnowTable, resetSnowTable } from '../registry';

// Cleanup after each test
afterEach(() => {
  cleanup();
  resetSnowTable();
});

// Setup SnowTable with mock dependencies before all tests
beforeAll(() => {
  setupSnowTable({
    t: (key: string) => key,
    LinkComponent: ({ to, children, ...props }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  });
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
