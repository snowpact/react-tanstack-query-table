/**
 * Mock types simulating an SDK response
 * Similar to SharedPublicBlogpostGetAll200BlogpostsItem
 */

export interface BlogpostItem {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  lang: 'fr' | 'en' | 'es' | 'de';
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  viewCount: number;
}

export type BlogpostStatus = BlogpostItem['status'];
