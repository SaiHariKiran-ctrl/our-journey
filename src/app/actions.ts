'use server';

import { neon } from '@neondatabase/serverless';
import { Memory, Todo } from '../lib/types';
import { v4 as uuidv4 } from 'uuid';
import { createTodo, getTodoById, updateTodo, deleteTodo } from '../lib/db';

const sql = neon(process.env.DATABASE_URL!);

export async function createMemory(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const tags = formData.get('tags') as string;
    const imageUrls = formData.getAll('imageUrls') as string[];

    const newMemory: Omit<Memory, 'id' | 'createdAt'> = {
      title,
      date,
      description,
      location: location || undefined,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
      imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
    };

    const id = uuidv4();
    const createdAt = Date.now();

    await sql`
      INSERT INTO memories (
        id, title, date, description, location, tags, image_urls, created_at
      ) VALUES (
        ${id},
        ${newMemory.title},
        ${newMemory.date},
        ${newMemory.description},
        ${newMemory.location},
        ${newMemory.tags},
        ${newMemory.imageUrls},
        ${createdAt}
      )
    `;

    return { success: true };
  } catch (error) {
    console.error('Error creating memory:', error);
    return { success: false, error: 'Failed to create memory' };
  }
}

export async function createComment(formData: FormData) {
  const sql = neon(process.env.DATABASE_URL as string);
  const comment = formData.get('comment');
  await sql`INSERT INTO comments (comment) VALUES (${comment})`;
}

export async function createTodoAction(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const dueDate = formData.get('dueDate') as string;
    const priority = parseInt(formData.get('priority') as string) || 0;
    const tags = formData.get('tags') as string;

    const newTodo: Omit<Todo, 'id' | 'createdAt'> = {
      title,
      description: description || undefined,
      isCompleted: false,
      dueDate: dueDate || undefined,
      priority,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
    };

    await createTodo(newTodo);

    return { success: true };
  } catch (error) {
    console.error('Error creating todo:', error);
    return { success: false, error: 'Failed to create todo' };
  }
}

export async function updateTodoStatus(id: string, isCompleted: boolean) {
  try {
    const todo = await getTodoById(id);
    if (!todo) {
      return { success: false, error: 'Todo not found' };
    }

    await updateTodo(id, {
      ...todo,
      isCompleted,
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating todo status:', error);
    return { success: false, error: 'Failed to update todo status' };
  }
}

export async function deleteTodoAction(id: string) {
  try {
    await deleteTodo(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting todo:', error);
    return { success: false, error: 'Failed to delete todo' };
  }
} 