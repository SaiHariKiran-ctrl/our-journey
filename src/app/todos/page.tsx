'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTodos, deleteTodo } from '../../lib/db';
import { Todo } from '../../lib/types';
import dayjs from 'dayjs';

export default function TodosPage() {
    const router = useRouter();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const data = await getTodos();
                setTodos(data);
            } catch (error) {
                console.error('Error fetching todos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTodos();
    }, []);

    const handleDelete = async (todoId: string) => {
        if (window.confirm('Are you sure you want to delete this todo?')) {
            try {
                await deleteTodo(todoId);
                setTodos(todos.filter((todo) => todo.id !== todoId));
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

    return (
        <div className="min-h-screen p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">
                        To-Do List
                    </h1>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link
                            href="/todos/add"
                            className="bg-primary hover:bg-primary-dark text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base">
                            Add New Todo
                        </Link>
                        <Link
                            href="/"
                            className="text-primary hover:text-primary-dark text-sm sm:text-base">
                            ← Back to Home
                        </Link>
                    </div>
                </div>

                <div className="grid gap-3 sm:gap-4">
                    {todos.map((todo) => (
                        <div
                            key={todo.id}
                            className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <input
                                type="checkbox"
                                checked={todo.isCompleted}
                                onChange={async () => {
                                    try {
                                        const response = await fetch(
                                            '/api/todos/status',
                                            {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type':
                                                        'application/json',
                                                },
                                                body: JSON.stringify({
                                                    id: todo.id,
                                                    isCompleted:
                                                        !todo.isCompleted,
                                                }),
                                            }
                                        );
                                        if (response.ok) {
                                            setTodos(
                                                todos.map((t) =>
                                                    t.id === todo.id
                                                        ? {
                                                              ...t,
                                                              isCompleted:
                                                                  !t.isCompleted,
                                                          }
                                                        : t
                                                )
                                            );
                                        }
                                    } catch (error) {
                                        console.error(
                                            'Error updating todo status:',
                                            error
                                        );
                                    }
                                }}
                                className="mt-1 h-4 w-4 sm:h-5 sm:w-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                                    <div>
                                        <h3
                                            className={`text-lg sm:text-xl font-semibold text-white mb-1 ${
                                                todo.isCompleted
                                                    ? 'line-through text-gray-400'
                                                    : ''
                                            }`}>
                                            {todo.title}
                                        </h3>
                                        {todo.description && (
                                            <p className="text-text-secondary text-sm sm:text-base">
                                                {todo.description}
                                            </p>
                                        )}
                                        {todo.dueDate && (
                                            <p className="text-sm text-gray-400 mt-1 sm:mt-2">
                                                Due:{' '}
                                                {dayjs(todo.dueDate).format(
                                                    'MMMM D, YYYY'
                                                )}
                                            </p>
                                        )}
                                        {todo.tags && todo.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {todo.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2 sm:gap-3">
                                        <button
                                            onClick={() =>
                                                router.push(
                                                    `/todos/${todo.id}/edit`
                                                )
                                            }
                                            className="text-primary hover:text-primary-dark text-sm sm:text-base">
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(todo.id)
                                            }
                                            className="text-red-500 hover:text-red-700 text-sm sm:text-base">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
