'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTodoById, deleteTodo } from '../../../lib/db';
import { Todo } from '../../../lib/types';
import dayjs from 'dayjs';

interface PageProps {
  params: {
    id: string;
  };
}

export default function TodoDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const foundTodo = await getTodoById(params.id);
        if (foundTodo) {
          setTodo(foundTodo);
        } else {
          router.push('/todos');
        }
      } catch (error) {
        console.error('Error fetching todo:', error);
        router.push('/todos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodo();
  }, [params.id, router]);

  const handleDelete = async () => {
    if (!todo) return;
    
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodo(todo.id);
        router.push('/todos');
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!todo) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Link 
          href="/todos"
          className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Todos
        </Link>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/todos/${todo.id}/edit`)}
            className="text-primary hover:text-primary-dark"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="glass-effect rounded-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <input
            type="checkbox"
            checked={todo.isCompleted}
            onChange={async () => {
              try {
                const response = await fetch('/api/todos/status', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    id: todo.id,
                    isCompleted: !todo.isCompleted,
                  }),
                });
                if (response.ok) {
                  setTodo({ ...todo, isCompleted: !todo.isCompleted });
                }
              } catch (error) {
                console.error('Error updating todo status:', error);
              }
            }}
            className="h-6 w-6 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <h1 className={`text-3xl font-bold text-white ${todo.isCompleted ? 'line-through text-gray-400' : ''}`}>
            {todo.title}
          </h1>
        </div>

        {todo.description && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Description</h2>
            <p className="text-text-secondary whitespace-pre-line">{todo.description}</p>
          </div>
        )}

        {todo.dueDate && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Due Date</h2>
            <p className="text-text-secondary">
              {dayjs(todo.dueDate).format('MMMM D, YYYY')}
            </p>
          </div>
        )}

        {todo.tags && todo.tags.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {todo.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-primary/20 text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Priority</h2>
          <p className="text-text-secondary">
            {todo.priority === 0 ? 'Low' : todo.priority === 1 ? 'Medium' : 'High'}
          </p>
        </div>
      </div>
    </div>
  );
} 