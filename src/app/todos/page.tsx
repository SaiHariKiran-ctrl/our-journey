'use client';

import { useState } from 'react';
import { todos as initialTodos } from '../../lib/todos';
import { Todo } from '../../lib/todos';
import Link from 'next/link';

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTodo, setNewTodo] = useState({ title: '', description: '', dueDate: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    ));
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const newTodoItem: Todo = {
      id: Date.now().toString(),
      title: newTodo.title,
      description: newTodo.description,
      isCompleted: false,
      createdAt: new Date().toISOString().split('T')[0],
      dueDate: newTodo.dueDate
    };
    setTodos([...todos, newTodoItem]);
    setNewTodo({ title: '', description: '', dueDate: '' });
    setShowAddForm(false);
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">To-Do List</h1>
          <Link href="/" className="text-primary hover:text-primary-dark">
            ← Back to Home
          </Link>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="mb-6 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          {showAddForm ? 'Cancel' : 'Add New Task'}
        </button>

        {showAddForm && (
          <form onSubmit={addTodo} className="mb-8 glass-effect p-6 rounded-xl">
            <div className="mb-4">
              <label className="block text-text-secondary mb-2">Title</label>
              <input
                type="text"
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                className="w-full p-2 rounded-lg bg-white/10 border border-gray-300"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-text-secondary mb-2">Description</label>
              <textarea
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                className="w-full p-2 rounded-lg bg-white/10 border border-gray-300"
                rows={3}
              />
            </div>
            <div className="mb-4">
              <label className="block text-text-secondary mb-2">Due Date</label>
              <input
                type="date"
                value={newTodo.dueDate}
                onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                className="w-full p-2 rounded-lg bg-white/10 border border-gray-300"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Add Task
            </button>
          </form>
        )}

        <div className="glass-effect rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-white/10">
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Description</th>
                  <th className="p-4 text-left">Due Date</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {todos.map((todo) => (
                  <tr key={todo.id} className="border-t border-white/10">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={todo.isCompleted}
                        onChange={() => toggleTodo(todo.id)}
                        className="w-5 h-5 rounded"
                      />
                    </td>
                    <td className="p-4">
                      <span className={todo.isCompleted ? 'line-through text-text-secondary' : ''}>
                        {todo.title}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={todo.isCompleted ? 'line-through text-text-secondary' : ''}>
                        {todo.description}
                      </span>
                    </td>
                    <td className="p-4">
                      {todo.dueDate && new Date(todo.dueDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 