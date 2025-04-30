'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddTodoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: '0',
    tags: '',
  });
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: {
      title?: string;
      description?: string;
    } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    setIsSubmitting(true);
    
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('title', formData.title);
      formDataToSubmit.append('description', formData.description);
      formDataToSubmit.append('dueDate', formData.dueDate);
      formDataToSubmit.append('priority', formData.priority);
      formDataToSubmit.append('tags', formData.tags);
      
      const response = await fetch('/api/todos', {
        method: 'POST',
        body: formDataToSubmit,
      });
      
      if (response.ok) {
        router.push('/todos');
      } else {
        throw new Error('Failed to create todo');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-white">Add New Todo</h1>
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
                name="title"
                value={formData.title}
                onChange={handleChange}
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
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/10 focus:border-transparent transition-colors bg-black text-white"
                placeholder="Add more details about this todo..."
              />
            </div>
            
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-white mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/10 focus:border-transparent transition-colors bg-black text-white"
              />
            </div>
            
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-white mb-1">
                Priority
              </label>
              <input
                type="number"
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                min="0"
                max="5"
                className="w-full px-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/10 focus:border-transparent transition-colors bg-black text-white"
              />
            </div>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-white mb-1">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/10 focus:border-transparent transition-colors bg-black text-white"
                placeholder="Add tags separated by commas (e.g., work, personal, urgent)"
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
                  <>Save Todo</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 