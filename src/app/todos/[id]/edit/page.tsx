'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Todo } from '../../../../lib/types';
import { getTodoById, updateTodo } from '../../../../lib/db';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../../../../app/memories/add/datepicker.css';

export default function EditTodoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
  }>({});

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const fetchedTodo = await getTodoById(params.id);
        if (!fetchedTodo) {
          setError('Todo not found');
          return;
        }
        setTodo(fetchedTodo);
      } catch (err) {
        setError('Failed to fetch todo');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [params.id]);

  const handleDateChange = (date: Date | null) => {
    if (date && todo) {
      setTodo({
        ...todo,
        dueDate: dayjs(date).format('YYYY-MM-DD')
      });
    }
  };

  const validateForm = () => {
    if (!todo) return false;
    
    const newErrors: {
      title?: string;
    } = {};
    
    if (!todo.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo) return;

    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        title: todo.title,
        description: todo.description,
        dueDate: todo.dueDate,
        priority: todo.priority,
        tags: todo.tags,
        isCompleted: todo.isCompleted,
      });

      if (updatedTodo) {
        router.push('/todos');
      } else {
        setError('Failed to update todo');
      }
    } catch (err) {
      setError('Failed to update todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="max-w-2xl mx-auto p-4 text-white">Loading...</div>;
  }

  if (error) {
    return <div className="max-w-2xl mx-auto p-4 text-red-500">{error}</div>;
  }

  if (!todo) {
    return <div className="max-w-2xl mx-auto p-4 text-white">Todo not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link 
        href="/todos"
        className="inline-flex items-center text-white mb-6 hover:text-gray-300 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Todos
      </Link>
      
      <div className="bg-black rounded-xl shadow-lg overflow-hidden border border-white/10">
        <div className="bg-black py-6 px-8 border-b border-white/10">
          <h1 className="text-2xl font-bold text-white">Edit Todo</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-white mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={todo.title}
                onChange={(e) => setTodo({ ...todo, title: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-white/10 focus:border-transparent transition-colors bg-black text-white
                  ${errors.title ? 'border-red-500' : 'border-white/10'}`}
                placeholder="What needs to be done?"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={todo.description || ''}
                onChange={(e) => setTodo({ ...todo, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/10 focus:border-transparent transition-colors bg-black text-white"
                placeholder="Add more details about this todo..."
              />
            </div>
            
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-white mb-1">
                Due Date
              </label>
              <DatePicker
                selected={todo.dueDate ? dayjs(todo.dueDate).toDate() : null}
                onChange={handleDateChange}
                dateFormat="MMMM d, yyyy"
                className="w-full px-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/10 focus:border-transparent transition-colors bg-black text-white"
                placeholderText="Select a due date"
                minDate={new Date()}
              />
            </div>
            
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-white mb-1">
                Priority
              </label>
              <select
                id="priority"
                value={todo.priority}
                onChange={(e) => setTodo({ ...todo, priority: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/10 focus:border-transparent transition-colors bg-black text-white"
              >
                <option value="0">Low</option>
                <option value="1">Medium</option>
                <option value="2">High</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-white mb-1">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={todo.tags?.join(', ') || ''}
                onChange={(e) => setTodo({ ...todo, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                className="w-full px-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/10 focus:border-transparent transition-colors bg-black text-white"
                placeholder="Add tags separated by commas"
              />
              <p className="mt-1 text-xs text-gray-400">
                Separate tags with commas
              </p>
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => router.push('/todos')}
                className="mr-4 px-4 py-2 text-white hover:text-gray-300 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-white hover:bg-gray-200 text-black px-6 py-2 rounded-lg transition-colors duration-200 flex items-center disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>Save Changes</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 