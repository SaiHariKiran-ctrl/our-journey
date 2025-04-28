// src/app/memories/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Memory } from '@/lib/types';
import { getMemoryById } from '@/lib/storage';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

export default function MemoryDetailPage({ params }: { params: { id: string } }) {
  const [memory, setMemory] = useState<Memory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load the memory when component mounts
    const foundMemory = getMemoryById(params.id);
    
    if (foundMemory) {
      setMemory(foundMemory);
    }
    
    setIsLoading(false);
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!memory) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-medium text-gray-600 mb-2">Memory not found</h3>
        <p className="text-gray-500 mb-6">The memory you're looking for doesn't exist</p>
        <Link 
          href="/memories"
          className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-6 rounded-lg transition-colors duration-200"
        >
          Back to Memories
        </Link>
      </div>
    );
  }

  const formattedDate = dayjs(memory.date).format('MMMM D, YYYY');

  return (
    <div className="max-w-4xl mx-auto">
      <Link 
        href="/memories"
        className="inline-flex items-center text-purple-600 mb-6 hover:text-purple-800 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Memory Box
      </Link>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="h-64 md:h-96 bg-gradient-to-r from-pink-300 to-purple-400 relative">
          {memory.imageUrl ? (
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl">💖</span>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white bg-opacity-90 px-4 py-2 rounded-full text-purple-600 inline-block text-lg"
            >
              {formattedDate}
            </motion.div>
          </div>
        </div>
        
        <div className="p-6 md:p-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-purple-700 mb-4"
          >
            {memory.title}
          </motion.h1>
          
          {memory.location && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-4 flex items-center text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {memory.location}
            </motion.div>
          )}
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-8 border-l-4 border-purple-300 pl-4 text-lg text-gray-700 whitespace-pre-line"
          >
            {memory.description}
          </motion.div>
          
          {memory.tags && memory.tags.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap gap-2 mt-6"
            >
              {memory.tags.map(tag => (
                <span key={tag} className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}