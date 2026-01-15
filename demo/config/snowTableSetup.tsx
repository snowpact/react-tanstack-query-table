/**
 * SnowTable Configuration Example
 *
 * This file demonstrates how to configure SnowTable with:
 * - i18next translations (mocked here)
 * - react-router-dom Link (mocked here)
 * - ConfirmDialog integration (simple implementation)
 *
 * Import this file once at app initialization (e.g., in main.tsx or App.tsx)
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { setupSnowTable, type SetupSnowTableOptions, type ConfirmContent } from '../../src';

// =============================================================================
// Mock Translations (simulating i18next)
// =============================================================================

const translations: Record<string, string> = {
  // Common
  'common.edit': 'Edit',
  'common.delete': 'Delete',
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.statut': 'Status',
  'common.search': 'Search',
  'common.actions': 'Actions',
  'common.loading': 'Loading...',

  // Table
  'table.noResults': 'No results found',
  'table.rowsPerPage': 'Rows per page',
  'table.page': 'Page',
  'table.of': 'of',
  'table.columns': 'Columns',
  'table.showing': 'Showing',
  'table.results': 'results',

  // Blogpost specific
  'blogpost.changeStatus': 'Change Status',
  'blogpost.changeStatusSubtitle': 'Select a new status for this blogpost',
  'blogpost.yesDelete': 'Yes, delete',
  'blogpost.confirmationDelete': 'Are you sure you want to delete this blogpost? This action cannot be undone.',

  // Data
  'data.category': 'Category',
  'data.url': 'URL',
  'data.image': 'Image',
};

const mockT = (key: string, params?: Record<string, unknown>): string => {
  let result = translations[key] || key;

  if (params) {
    Object.entries(params).forEach(([paramKey, value]) => {
      result = result.replace(`{{${paramKey}}}`, String(value));
    });
  }

  return result;
};

// =============================================================================
// Mock Link Component (simulating react-router-dom)
// =============================================================================

interface MockLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

const MockLink: React.FC<MockLinkProps> = ({ to, children, className }) => {
  return (
    <a href={to} className={className} onClick={e => e.preventDefault()}>
      {children}
    </a>
  );
};

// =============================================================================
// Simple Confirm Dialog Implementation
// =============================================================================

interface ConfirmOptions {
  title: string;
  subtitle?: string;
  content: ConfirmContent;
  confirmText?: string;
  cancelText?: string;
  hideButtons?: boolean;
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  isOpen: boolean;
  close: () => void;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

interface ConfirmDialogProviderProps {
  children: ReactNode;
}

export const ConfirmDialogProvider: React.FC<ConfirmDialogProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise(resolve => {
      setOptions(opts);
      setIsOpen(true);
      setResolveRef(() => resolve);
    });
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setOptions(null);
    resolveRef?.(false);
    setResolveRef(null);
  }, [resolveRef]);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    setOptions(null);
    resolveRef?.(true);
    setResolveRef(null);
  }, [resolveRef]);

  const resolvedContent =
    typeof options?.content === 'function' ? options.content({ close }) : options?.content;

  return (
    <ConfirmContext.Provider value={{ confirm, isOpen, close }}>
      {children}

      {/* Simple Modal Overlay */}
      {isOpen && options && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={close} />

          {/* Dialog */}
          <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">{options.title}</h2>

            {options.subtitle && <p className="mt-1 text-sm text-gray-500">{options.subtitle}</p>}

            <div className="mt-4">{resolvedContent}</div>

            {!options.hideButtons && (
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={close}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {options.cancelText || 'Cancel'}
                </button>
                <button
                  onClick={handleConfirm}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  {options.confirmText || 'Confirm'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = (): ConfirmContextValue => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmDialogProvider');
  }
  return context;
};

// =============================================================================
// SnowTable Setup
// =============================================================================

let isSetup = false;

/**
 * Initialize SnowTable with translations and link component
 * Call this once at app startup
 */
export function setupSnowTableConfig(): void {
  if (isSetup) {
    return;
  }

  const options: SetupSnowTableOptions = {
    // Translation hook (mocked)
    useTranslation: () => ({
      t: mockT,
    }),

    // Link component (mocked)
    LinkComponent: MockLink,

    // Confirm dialog hook
    useConfirm: () => {
      const { confirm } = useConfirm();
      return {
        confirm: async (opts: {
          title: string;
          subtitle?: string;
          content: ConfirmContent;
          confirmText?: string;
          cancelText?: string;
          hideButtons?: boolean;
        }) => {
          return confirm(opts);
        },
      };
    },

    // Custom styles - example with blue theme
    styles: {
      state: {
        active: 'ring-2 ring-blue-500/40',
        activeText: 'text-blue-600',
        focus: 'ring-2 ring-blue-500/40',
      },
      table: {
        rowActive: 'bg-blue-50',
      },
    },
  };

  setupSnowTable(options);
  isSetup = true;
}

// Export for use in App
export { mockT };
