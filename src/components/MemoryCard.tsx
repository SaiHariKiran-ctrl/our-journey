// src/components/MemoryCard.tsx
'use client';

import Link from 'next/link';
import { Memory } from '@/lib/types';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

interface MemoryCardProps {
  memory: Memory;
}

export default function MemoryCard({ memory }: MemoryCardProps) {
  const formattedDate = dayjs(memory.date).format('MMMM D, YYYY');
  
  // Random pastel background color based on memory ID
  const getBackgroundColor = () => {
    const colors = [
      'bg-pink-100', 'bg-purple-100', 'bg-blue-100', 
      'bg-green-100', 'bg-yellow-100', 'bg-red-100'
    ];
    const index = memory.id.charCodeAt(0) % colors.length;
    return colors[index];
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <Link href={`/memories/${memory.id}`}>
        <div className={`h-40 ${getBackgroundColor()} relative`}>
          {memory.imageUrl ? (
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl">💖</span>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm text-purple-600 inline-block">
              {formattedDate}
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-xl font-semibold text-purple-700 mb-2">{memory.title}</h3>
          <p className="text-gray-600 line-clamp-2">{memory.description}</p>
          
          {memory.location && (
            <div className="mt-3 flex items-center text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {memory.location}
            </div>
          )}
          
          {memory.tags && memory.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {memory.tags.map(tag => (
                <span key={tag} className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}