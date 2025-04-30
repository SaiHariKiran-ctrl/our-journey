'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getMemories, deleteMemory } from '../../lib/db';
import { Memory } from '../../lib/types';

const truncateText = (text: string, maxWords: number) => {
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
};

export default function MemoriesPage() {
    const router = useRouter();
    const [memories, setMemories] = useState<Memory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMemories = async () => {
            try {
                const data = await getMemories();
                setMemories(data);
            } catch (error) {
                console.error('Error fetching memories:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMemories();
    }, []);

    const handleDelete = async (e: React.MouseEvent, memoryId: string) => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to delete this memory?')) {
            try {
                await deleteMemory(memoryId);
                setMemories(
                    memories.filter((memory) => memory.id !== memoryId)
                );
            } catch (error) {
                console.error('Error deleting memory:', error);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                        All Memories
                    </h1>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                        <Link
                            href="/memories/add"
                            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto text-center">
                            Add New Memory
                        </Link>
                        <Link
                            href="/"
                            className="text-primary hover:text-primary-dark w-full sm:w-auto text-center">
                            ← Back to Home
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 sm:gap-6">
                    {memories.map((memory) => (
                        <Link
                            key={memory.id}
                            href={`/memories/${memory.id}`}
                            className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            {memory.imageUrls &&
                                memory.imageUrls.length > 0 && (
                                    <div className="relative w-full sm:w-24 h-48 sm:h-24 flex-shrink-0">
                                        <Image
                                            src={memory.imageUrls[0]}
                                            alt={memory.title}
                                            fill
                                            className="object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                            <div className="flex-1 w-full">
                                <div className="flex flex-col">
                                    <div className="mb-3">
                                        <div className="bg-primary/20 px-4 py-2 rounded-lg inline-block">
                                            <span className="text-primary font-semibold">
                                                {new Date(
                                                    memory.date
                                                ).toLocaleDateString('en-US', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                                                {memory.title}
                                            </h3>
                                            <p className="text-text-secondary">
                                                {truncateText(
                                                    memory.description,
                                                    20
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 self-end sm:self-auto">
                                            <button
                                                className="text-primary hover:text-primary-dark"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    router.push(
                                                        `/memories/${memory.id}/edit`
                                                    );
                                                }}>
                                                Edit
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={(e) =>
                                                    handleDelete(e, memory.id)
                                                }>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
