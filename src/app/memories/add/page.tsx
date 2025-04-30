'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createMemory } from '../../actions';
import { Memory } from '../../../lib/types';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './datepicker.css';
import Image from 'next/image';

export default function AddMemoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    date: dayjs().format('YYYY-MM-DD'),
    description: '',
    location: '',
    tags: '',
    imageUrls: [] as string[],
  });
  
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
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
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newPreviewUrls: string[] = [];
    const newImageUrls: string[] = [];
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        newPreviewUrls.push(result);
        newImageUrls.push(result);
        
        if (newPreviewUrls.length === files.length) {
          setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
          setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ...newImageUrls] }));
        }
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removeImage = (index: number) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    setIsSubmitting(true);
    
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('title', formData.title);
      formDataToSubmit.append('date', formData.date);
      formDataToSubmit.append('description', formData.description);
      formDataToSubmit.append('location', formData.location);
      formDataToSubmit.append('tags', formData.tags);
      formData.imageUrls.forEach(url => {
        formDataToSubmit.append('imageUrls', url);
      });
      
      const result = await createMemory(formDataToSubmit);
      
      if (result.success) {
        setIsSubmitting(true);
        router.push('/memories');
      } else {
        throw new Error(result.error);
      }
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
                // maxDate={new Date()}
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
            
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Images
              </label>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative w-32 h-32">
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-2 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-white"
                  >
                    Add Images
                  </button>
                  <p className="mt-1 text-xs text-gray-400">
                    You can select multiple images
                  </p>
                </div>
              </div>
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