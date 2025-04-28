'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { addMemory } from '../../../lib/storage';
import { Memory } from '../../../lib/types';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './datepicker.css';

export default function AddMemoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    date: dayjs().format('YYYY-MM-DD'),
    description: '',
    location: '',
    tags: '',
  });
  
  const [errors, setErrors] = useState<{
    title?: string;
    date?: string;
    description?: string;
  }>({});
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({ ...prev, date: dayjs(date).format('YYYY-MM-DD') }));
      if (errors.date) {
        setErrors(prev => ({ ...prev, date: undefined }));
      }
    }
  };
  
  const validateForm = () => {
    const newErrors: {
      title?: string;
      date?: string;
      description?: string;
    } = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      const newMemory: Omit<Memory, 'id' | 'createdAt'> = {
        title: formData.title,
        date: formData.date,
        description: formData.description,
        location: formData.location || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      };
      
      addMemory(newMemory);
      
      router.push('/memories');
    } catch (error) {
      console.error('Error adding memory:', error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <Link 
        href="/memories"
        className="inline-flex items-center text-white mb-6 hover:text-gray-300 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Memory Box
      </Link>
      
      <div className="bg-black rounded-xl shadow-lg overflow-hidden border border-white/10">
        <div className="bg-black py-6 px-8 border-b border-white/10">
          <h1 className="text-2xl font-bold text-white">Add New Memory</h1>
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
                placeholder="Give this memory a title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-white mb-1">
                Date *
              </label>
              <DatePicker
                selected={dayjs(formData.date).toDate()}
                onChange={handleDateChange}
                dateFormat="MMMM d, yyyy"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-white/10 focus:border-transparent transition-colors bg-black text-white
                  ${errors.date ? 'border-red-500' : 'border-white/10'}`}
                placeholderText="Select a date"
                maxDate={new Date()}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-500">{errors.date}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-white mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/10 focus:border-transparent transition-colors bg-black text-white"
                placeholder="Where did this happen? (optional)"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-white/10 focus:border-transparent transition-colors bg-black text-white
                  ${errors.description ? 'border-red-500' : 'border-white/10'}`}
                placeholder="Describe this special memory..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
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
                placeholder="Add tags separated by commas (e.g., date, anniversary, surprise)"
              />
              <p className="mt-1 text-xs text-gray-400">
                Separate tags with commas
              </p>
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => router.push('/memories')}
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
                  <>Save Memory</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}