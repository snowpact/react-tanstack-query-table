import { BlogpostItem } from './types';

export const mockBlogposts: BlogpostItem[] = [
  {
    id: '1',
    title: 'Introduction to React Query',
    slug: 'introduction-to-react-query',
    imageUrl: 'https://picsum.photos/seed/1/400/300',
    lang: 'en',
    tags: ['react', 'typescript', 'tutorial'],
    status: 'published',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    author: { id: 'a1', name: 'John Doe', email: 'john@example.com' },
    viewCount: 1234,
  },
  {
    id: '2',
    title: 'Les bases de TanStack Table',
    slug: 'les-bases-de-tanstack-table',
    imageUrl: 'https://picsum.photos/seed/2/400/300',
    lang: 'fr',
    tags: ['react', 'table', 'guide'],
    status: 'published',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-18T09:15:00Z',
    author: { id: 'a2', name: 'Marie Dupont', email: 'marie@example.com' },
    viewCount: 856,
  },
  {
    id: '3',
    title: 'Advanced TypeScript Patterns',
    slug: 'advanced-typescript-patterns',
    imageUrl: null,
    lang: 'en',
    tags: ['typescript', 'advanced', 'patterns'],
    status: 'draft',
    createdAt: '2024-01-22T11:00:00Z',
    updatedAt: '2024-01-22T11:00:00Z',
    author: { id: 'a1', name: 'John Doe', email: 'john@example.com' },
    viewCount: 0,
  },
  {
    id: '4',
    title: 'Guia de React Hooks',
    slug: 'guia-de-react-hooks',
    imageUrl: 'https://picsum.photos/seed/4/400/300',
    lang: 'es',
    tags: ['react', 'hooks', 'tutorial'],
    status: 'published',
    createdAt: '2024-01-05T16:00:00Z',
    updatedAt: '2024-01-12T10:45:00Z',
    author: { id: 'a3', name: 'Carlos Garcia', email: 'carlos@example.com' },
    viewCount: 2341,
  },
  {
    id: '5',
    title: 'State Management in 2024',
    slug: 'state-management-2024',
    imageUrl: 'https://picsum.photos/seed/5/400/300',
    lang: 'en',
    tags: ['react', 'state', 'zustand', 'jotai'],
    status: 'archived',
    createdAt: '2023-12-01T09:00:00Z',
    updatedAt: '2024-01-02T08:00:00Z',
    author: { id: 'a2', name: 'Marie Dupont', email: 'marie@example.com' },
    viewCount: 5678,
  },
  {
    id: '6',
    title: 'Einführung in React Testing',
    slug: 'einfuhrung-react-testing',
    imageUrl: 'https://picsum.photos/seed/6/400/300',
    lang: 'de',
    tags: ['react', 'testing', 'vitest'],
    status: 'published',
    createdAt: '2024-01-08T14:00:00Z',
    updatedAt: '2024-01-15T16:20:00Z',
    author: { id: 'a4', name: 'Hans Mueller', email: 'hans@example.com' },
    viewCount: 432,
  },
  {
    id: '7',
    title: 'Building Accessible Components',
    slug: 'building-accessible-components',
    imageUrl: 'https://picsum.photos/seed/7/400/300',
    lang: 'en',
    tags: ['accessibility', 'a11y', 'react'],
    status: 'draft',
    createdAt: '2024-01-25T12:00:00Z',
    updatedAt: '2024-01-25T12:00:00Z',
    author: { id: 'a1', name: 'John Doe', email: 'john@example.com' },
    viewCount: 0,
  },
  {
    id: '8',
    title: 'Performance Optimization React',
    slug: 'performance-optimization-react',
    imageUrl: 'https://picsum.photos/seed/8/400/300',
    lang: 'fr',
    tags: ['react', 'performance', 'optimization'],
    status: 'published',
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-10T11:30:00Z',
    author: { id: 'a2', name: 'Marie Dupont', email: 'marie@example.com' },
    viewCount: 1567,
  },
  {
    id: '9',
    title: 'CSS-in-JS vs Tailwind',
    slug: 'css-in-js-vs-tailwind',
    imageUrl: null,
    lang: 'en',
    tags: ['css', 'tailwind', 'styled-components'],
    status: 'archived',
    createdAt: '2023-11-15T08:00:00Z',
    updatedAt: '2023-12-20T14:00:00Z',
    author: { id: 'a3', name: 'Carlos Garcia', email: 'carlos@example.com' },
    viewCount: 8923,
  },
  {
    id: '10',
    title: 'Next.js 14 Features',
    slug: 'nextjs-14-features',
    imageUrl: 'https://picsum.photos/seed/10/400/300',
    lang: 'en',
    tags: ['nextjs', 'react', 'ssr'],
    status: 'published',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-23T15:45:00Z',
    author: { id: 'a4', name: 'Hans Mueller', email: 'hans@example.com' },
    viewCount: 3456,
  },
];

/**
 * Simulate API call with delay
 */
export const fetchBlogposts = async (): Promise<BlogpostItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockBlogposts;
};

/**
 * Simulate delete API call
 */
export const deleteBlogpost = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`Deleted blogpost ${id}`);
};
