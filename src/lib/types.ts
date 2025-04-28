// src/lib/types.ts

export interface Memory {
  id: string;
  title: string;
  date: string; // Format: YYYY-MM-DD
  description: string;
  imageUrl?: string; // Optional image URL
  tags?: string[]; // Optional tags
  location?: string; // Optional location
  createdAt: number; // Timestamp
}