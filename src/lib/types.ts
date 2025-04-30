// src/lib/types.ts

export interface Memory {
  id: string;
  title: string;
  date: string; // Format: YYYY-MM-DD
  description: string;
  imageUrls?: string[]; // Array of image URLs
  tags?: string[]; // Optional tags
  location?: string; // Optional location
  createdAt: number; // Timestamp
  isHighlighted: boolean; // Whether this memory is highlighted
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: number;
  dueDate?: string;
  priority: number;
  tags?: string[];
}