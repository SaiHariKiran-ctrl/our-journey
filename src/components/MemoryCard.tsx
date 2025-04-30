// src/components/MemoryCard.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { Memory } from '../lib/types';

interface MemoryCardProps {
  memory: Memory;
}

export default function MemoryCard({ memory }: MemoryCardProps) {
  const formattedDate = dayjs(memory.date).format('MMMM D, YYYY');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Random pastel background color based on memory ID
  const getBackgroundColor = () => {
    const colors = [
      'bg-pink-100', 'bg-purple-100', 'bg-blue-100', 
      'bg-green-100', 'bg-yellow-100', 'bg-red-100'
    ];
    const index = memory.id.charCodeAt(0) % colors.length;
    return colors[index];
  };
  
  const nextImage = () => {
    if (memory.imageUrls && memory.imageUrls.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % memory.imageUrls!.length);
    }
  };
  
  const prevImage = () => {
    if (memory.imageUrls && memory.imageUrls.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + memory.imageUrls!.length) % memory.imageUrls!.length);
    }
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
          {memory.imageUrls && memory.imageUrls.length > 0 ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
              <Image
                src={memory.imageUrls[currentImageIndex]}
                alt={memory.title}
                fill
                className="object-cover"
              />
              {memory.imageUrls.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      prevImage();
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    ←
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      nextImage();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    →
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {memory.imageUrls.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{memory.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{memory.description}</p>
          
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