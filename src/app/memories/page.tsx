// src/app/memories/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { memories } from '../../lib/memories';

export default function MemoriesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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