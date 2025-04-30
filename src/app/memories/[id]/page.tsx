'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getMemoryById, updateMemory, deleteMemory } from '../../../lib/db';
import { Memory } from '../../../lib/types';
import dayjs from 'dayjs';

interface PageProps {
    params: {
        id: string;
    };
}

export default function MemoryDetailPage({ params }: PageProps) {
    const router = useRouter();
    const [memory, setMemory] = useState<Memory | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMemory = async () => {
            try {
                const foundMemory = await getMemoryById(params.id);
                if (foundMemory) {
                    setMemory(foundMemory);
                } else {
                    router.push('/memories');
                }
            } catch (error) {
                console.error('Error fetching memory:', error);
                router.push('/memories');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMemory();
    }, [params.id, router]);

    const nextImage = () => {
        if (memory?.imageUrls && memory.imageUrls.length > 0) {
            setCurrentImageIndex(
                (prev) => (prev + 1) % memory.imageUrls!.length
            );
        }
    };

    const prevImage = () => {
        if (memory?.imageUrls && memory.imageUrls.length > 0) {
            setCurrentImageIndex(
                (prev) =>
                    (prev - 1 + memory.imageUrls!.length) %
                    memory.imageUrls!.length
            );
        }
    };

    const toggleHighlight = async () => {
        if (!memory) return;

        try {
            const updatedMemory = await updateMemory(memory.id, {
                ...memory,
                isHighlighted: !memory.isHighlighted,
            });
            if (updatedMemory) {
                setMemory(updatedMemory);
            }
        } catch (error) {
            console.error('Error updating memory highlight status:', error);
        }
    };

    const handleDelete = async () => {
        if (!memory) return;

        if (window.confirm('Are you sure you want to delete this memory?')) {
            try {
                await deleteMemory(memory.id);
                router.push('/memories');
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

    if (!memory) return null;

    const formattedDate = dayjs(memory.date).format('MMMM D, YYYY');

    const convertUrlsToLinks = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.split(urlRegex).map((part, index) => {
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-dark underline">
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <Link
                    href="/memories"
                    className="inline-flex items-center text-primary hover:text-primary-dark transition-colors">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Back to Memory Box
                </Link>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleDelete}
                        className="text-red-500 hover:text-red-700 transition-colors">
                        Delete Memory
                    </button>
                    <button
                        onClick={toggleHighlight}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        title={
                            memory?.isHighlighted
                                ? 'Remove from highlights'
                                : 'Add to highlights'
                        }>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 ${
                                memory?.isHighlighted
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-400'
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </button>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-effect rounded-xl overflow-hidden">
                <div className="h-64 md:h-96 relative">
                    {memory.imageUrls && memory.imageUrls.length > 0 ? (
                        <>
                            <Image
                                src={memory.imageUrls[currentImageIndex]}
                                alt={memory.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
                            {memory.imageUrls.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full w-10 h-10 flex items-center justify-center">
                                        ←
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full w-10 h-10 flex items-center justify-center">
                                        →
                                    </button>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                        {memory.imageUrls.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    setCurrentImageIndex(index)
                                                }
                                                className={`w-3 h-3 rounded-full transition-colors ${
                                                    index === currentImageIndex
                                                        ? 'bg-white'
                                                        : 'bg-white/50'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-400 flex items-center justify-center">
                            <span className="text-8xl">💖</span>
                        </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white inline-block text-lg">
                            {formattedDate}
                        </motion.div>
                    </div>
                </div>

                <div className="p-8">
                    <h1 className="text-3xl font-bold text-white mb-4">
                        {memory.title}
                    </h1>

                    {memory.location && (
                        <div className="flex items-center text-text-secondary mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {memory.location}
                        </div>
                    )}

                    <p className="text-text-secondary mb-6 whitespace-pre-line">
                        {convertUrlsToLinks(memory.description)}
                    </p>

                    {memory.tags && memory.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {memory.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-white/10 text-white px-3 py-1 rounded-full text-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
