/**
 * Example App Entry Point
 *
 * This file exports all the example components and utilities.
 * To use this example in a real app, you would:
 *
 * 1. Copy the relevant files to your project
 * 2. Adapt the imports to your project structure
 * 3. Replace mocks with real API calls
 */

// Main App
export { App, default } from './App';

// Configuration
export { setupSnowTableConfig, ConfirmDialogProvider, useConfirm, mockT } from './config/snowTableSetup';

// Components
export { BlogpostTable } from './components/BlogpostTable';
export { StatusBlogpost } from './components/StatusBlogpost';
export { Badge } from './components/Badge';

// Types
export type { BlogpostItem, BlogpostStatus } from './mocks/types';

// Mock data and API functions
export { mockBlogposts, fetchBlogposts, deleteBlogpost } from './mocks/data';
