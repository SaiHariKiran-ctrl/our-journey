// src/app/memories/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Memory } from '@/lib/types';
import { getMemories } from '@/lib/storage';
import MemoryCard from '@/components/MemoryCard';
import { memories } from '@/lib/memories';
import Image from 'next/image';

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load memories when component mounts
    const loadedMemories = getMemories();
    
    // Sort by date (newest first)
    loadedMemories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setMemories(loadedMemories);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">All Memories</h1>
          <div className="flex items-center gap-4">
            <Link href="/memories/add" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors">
              Add New Memory
            </Link>
            <Link href="/" className="text-primary hover:text-primary-dark">
              ← Back to Home
            </Link>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden">
          <div className="grid gap-6">
            {memories.map((memory) => (
              <div key={memory.id} className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                {memory.imageUrl && (
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={memory.imageUrl}
                      alt={memory.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex flex-col">
                    <div className="mb-3">
                      <div className="bg-primary/20 px-4 py-2 rounded-lg inline-block">
                        <span className="text-primary font-semibold">
                          {new Date(memory.date).toLocaleDateString('en-US', { 
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">{memory.title}</h3>
                        <p className="text-text-secondary">{memory.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-primary hover:text-primary-dark">
                          Edit
                        </button>
                        <button className="text-red-500 hover:text-red-700">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}