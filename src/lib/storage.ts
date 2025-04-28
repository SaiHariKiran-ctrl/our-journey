// src/lib/storage.ts
import { v4 as uuidv4 } from 'uuid';
import { Memory } from './types';

const STORAGE_KEY = 'our-memories';

// Sample memories - replace with your own
const INITIAL_MEMORIES: Memory[] = [
  {
    id: '1',
    title: 'Our First Date',
    date: '2022-04-20',
    description: 'We went to that cute café downtown and talked for hours. You wore that blue dress I love.',
    location: 'Downtown Café',
    tags: ['date', 'beginning'],
    createdAt: 1650470400000,
  },
  {
    id: '2',
    title: 'Beach Weekend',
    date: '2022-06-15',
    description: 'That perfect weekend at the beach. We built sandcastles and watched the sunset.',
    location: 'Sunny Beach',
    tags: ['travel', 'weekend'],
    createdAt: 1655251200000,
  },
  {
    id: '3',
    title: 'Your Birthday Last Year',
    date: '2023-04-28',
    description: 'We celebrated at the rooftop restaurant. I surprised you with those earrings you wanted.',
    location: 'Skyline Restaurant',
    tags: ['birthday', 'celebration'],
    createdAt: 1682640000000,
  },
];

// Get all memories
export const getMemories = (): Memory[] => {
  if (typeof window === 'undefined') return [];
  
  const storedMemories = localStorage.getItem(STORAGE_KEY);
  
  if (!storedMemories) {
    // Initialize with sample memories if none exist
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEMORIES));
    return INITIAL_MEMORIES;
  }
  
  return JSON.parse(storedMemories);
};

// Get a single memory by ID
export const getMemoryById = (id: string): Memory | undefined => {
  const memories = getMemories();
  return memories.find(memory => memory.id === id);
};

// Add a new memory
export const addMemory = (memory: Omit<Memory, 'id' | 'createdAt'>): Memory => {
  const newMemory: Memory = {
    ...memory,
    id: uuidv4(),
    createdAt: Date.now(),
  };
  
  const memories = getMemories();
  const updatedMemories = [...memories, newMemory];
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMemories));
  
  return newMemory;
};

// Update an existing memory
export const updateMemory = (updatedMemory: Memory): Memory => {
  const memories = getMemories();
  const updatedMemories = memories.map(memory => 
    memory.id === updatedMemory.id ? updatedMemory : memory
  );
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMemories));
  
  return updatedMemory;
};

// Delete a memory
export const deleteMemory = (id: string): void => {
  const memories = getMemories();
  const updatedMemories = memories.filter(memory => memory.id !== id);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMemories));
};