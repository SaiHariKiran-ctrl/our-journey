'use server';

import { neon } from '@neondatabase/serverless';
import { Memory } from './types';
import { Todo } from './types';
import { v4 as uuidv4 } from 'uuid';

const sql = neon(process.env.DATABASE_URL!);

export async function getMemories(): Promise<Memory[]> {
  
  const result = await sql`
    SELECT 
      id,
      title,
      date,
      description,
      location,
      tags,
      image_urls as "imageUrls",
      created_at as "createdAt",
      is_highlighted as "isHighlighted"
    FROM memories
    ORDER BY created_at DESC
  `;
  
  return result.map(row => ({
    id: row.id,
    title: row.title,
    date: new Date(row.date).toISOString().split('T')[0],
    description: row.description,
    location: row.location || undefined,
    tags: row.tags || undefined,
    imageUrls: row.imageUrls || undefined,
    createdAt: Number(row.createdAt),
    isHighlighted: row.isHighlighted || false
  }));
}

export async function getMemoryById(id: string): Promise<Memory | null> {
  const result = await sql`
    SELECT 
      id,
      title,
      date,
      description,
      location,
      tags,
      image_urls as "imageUrls",
      created_at as "createdAt",
      is_highlighted as "isHighlighted"
    FROM memories
    WHERE id = ${id}
  `;
  
  if (result.length === 0) return null;
  
  const row = result[0];
  return {
    id: row.id,
    title: row.title,
    date: new Date(row.date).toISOString().split('T')[0],
    description: row.description,
    location: row.location || undefined,
    tags: row.tags || undefined,
    imageUrls: row.imageUrls || undefined,
    createdAt: Number(row.createdAt),
    isHighlighted: row.isHighlighted || false
  };
}

export async function updateMemory(id: string, memory: Omit<Memory, 'id' | 'createdAt'>): Promise<Memory | null> {
  const result = await sql`
    UPDATE memories
    SET 
      title = ${memory.title},
      date = ${memory.date},
      description = ${memory.description},
      location = ${memory.location || null},
      tags = ${memory.tags || null},
      image_urls = ${memory.imageUrls || null},
      is_highlighted = ${memory.isHighlighted}
    WHERE id = ${id}
    RETURNING 
      id,
      title,
      date,
      description,
      location,
      tags,
      image_urls as "imageUrls",
      created_at as "createdAt",
      is_highlighted as "isHighlighted"
  `;
  
  if (result.length === 0) return null;
  
  const row = result[0];
  return {
    id: row.id,
    title: row.title,
    date: new Date(row.date).toISOString().split('T')[0],
    description: row.description,
    location: row.location || undefined,
    tags: row.tags || undefined,
    imageUrls: row.imageUrls || undefined,
    createdAt: Number(row.createdAt),
    isHighlighted: row.isHighlighted || false
  };
}

export async function getTodos(): Promise<Todo[]> {
  const result = await sql`
    SELECT 
      id,
      title,
      description,
      is_completed as "isCompleted",
      created_at as "createdAt",
      due_date as "dueDate",
      priority,
      tags
    FROM todos
    ORDER BY created_at DESC
  `;
  
  return result.map(row => ({
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    isCompleted: row.isCompleted || false,
    createdAt: Number(row.createdAt),
    dueDate: row.dueDate ? new Date(row.dueDate).toISOString().split('T')[0] : undefined,
    priority: row.priority || 0,
    tags: row.tags || undefined
  }));
}

export async function getTodoById(id: string): Promise<Todo | null> {
  const result = await sql`
    SELECT 
      id,
      title,
      description,
      is_completed as "isCompleted",
      created_at as "createdAt",
      due_date as "dueDate",
      priority,
      tags
    FROM todos
    WHERE id = ${id}
  `;
  
  if (result.length === 0) return null;
  
  const row = result[0];
  return {
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    isCompleted: row.isCompleted || false,
    createdAt: Number(row.createdAt),
    dueDate: row.dueDate ? new Date(row.dueDate).toISOString().split('T')[0] : undefined,
    priority: row.priority || 0,
    tags: row.tags || undefined
  };
}

export async function createTodo(todo: Omit<Todo, 'id' | 'createdAt'>): Promise<Todo> {
  const id = uuidv4();
  const createdAt = Date.now();

  const result = await sql`
    INSERT INTO todos (
      id, title, description, is_completed, created_at, due_date, priority, tags
    ) VALUES (
      ${id},
      ${todo.title},
      ${todo.description || null},
      ${todo.isCompleted},
      ${createdAt},
      ${todo.dueDate || null},
      ${todo.priority},
      ${todo.tags || null}
    )
    RETURNING 
      id,
      title,
      description,
      is_completed as "isCompleted",
      created_at as "createdAt",
      due_date as "dueDate",
      priority,
      tags
  `;

  const row = result[0];
  return {
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    isCompleted: row.isCompleted || false,
    createdAt: Number(row.createdAt),
    dueDate: row.dueDate ? new Date(row.dueDate).toISOString().split('T')[0] : undefined,
    priority: row.priority || 0,
    tags: row.tags || undefined
  };
}

export async function updateTodo(id: string, todo: Omit<Todo, 'id' | 'createdAt'>): Promise<Todo | null> {
  const result = await sql`
    UPDATE todos
    SET 
      title = ${todo.title},
      description = ${todo.description || null},
      is_completed = ${todo.isCompleted},
      due_date = ${todo.dueDate || null},
      priority = ${todo.priority},
      tags = ${todo.tags || null}
    WHERE id = ${id}
    RETURNING 
      id,
      title,
      description,
      is_completed as "isCompleted",
      created_at as "createdAt",
      due_date as "dueDate",
      priority,
      tags
  `;
  
  if (result.length === 0) return null;
  
  const row = result[0];
  return {
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    isCompleted: row.isCompleted || false,
    createdAt: Number(row.createdAt),
    dueDate: row.dueDate ? new Date(row.dueDate).toISOString().split('T')[0] : undefined,
    priority: row.priority || 0,
    tags: row.tags || undefined
  };
}

export async function deleteTodo(id: string): Promise<void> {
  await sql`
    DELETE FROM todos
    WHERE id = ${id}
  `;
}

export async function deleteMemory(id: string): Promise<void> {
  await sql`
    DELETE FROM memories
    WHERE id = ${id}
  `;
} 