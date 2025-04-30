'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMemoryById, updateMemory } from '../../../../lib/db';
import { Memory } from '../../../../lib/types';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../../app/memories/add/datepicker.css';
import Image from 'next/image';

interface EditMemoryPageProps {
    params: {
        id: string;
    };
    searchParams?: { [key: string]: string | string[] | undefined };
}

export default function EditMemoryPage({ params }: EditMemoryPageProps) {
    const router = useRouter();
    const [memory, setMemory] = useState<Memory | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [errors, setErrors] = useState<{
        title?: string;
        date?: string;
        description?: string;
    }>({});

    useEffect(() => {
        const fetchMemory = async () => {
            try {
                const data = await getMemoryById(params.id);
                if (!data) {
                    setError('Memory not found');
                    return;
                }
                setMemory(data);
                setPreviewUrls(data.imageUrls || []);
            } catch (err) {
                setError('Failed to load memory');
            } finally {
                setLoading(false);
            }
        };
        fetchMemory();
    }, [params.id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newPreviewUrls: string[] = [];
        const newImageUrls: string[] = [];

        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                newPreviewUrls.push(result);
                newImageUrls.push(result);

                if (newPreviewUrls.length === files.length) {
                    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
                    if (memory) {
                        setMemory({
                            ...memory,
                            imageUrls: [
                                ...(memory.imageUrls || []),
                                ...newImageUrls,
                            ],
                        });
                    }
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
        if (memory) {
            setMemory({
                ...memory,
                imageUrls: memory.imageUrls?.filter((_, i) => i !== index),
            });
        }
    };

    const handleDateChange = (date: Date | null) => {
        if (date && memory) {
            setMemory({
                ...memory,
                date: dayjs(date).format('YYYY-MM-DD'),
            });
            if (errors.date) {
                setErrors((prev) => ({ ...prev, date: undefined }));
            }
        }
    };

    const validateForm = () => {
        if (!memory) return false;

        const newErrors: {
            title?: string;
            date?: string;
            description?: string;
        } = {};

        if (!memory.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!memory.date) {
            newErrors.date = 'Date is required';
        }
        if (!memory.description.trim()) {
            newErrors.description = 'Description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!memory) return;

        if (!validateForm()) return;
        setIsSubmitting(true);

        try {
            const updatedMemory = await updateMemory(memory.id, {
                title: memory.title,
                date: memory.date,
                description: memory.description,
                location: memory.location,
                tags: memory.tags,
                imageUrls: memory.imageUrls,
                isHighlighted: memory.isHighlighted,
            });

            if (updatedMemory) {
                router.push(`/memories/${memory.id}`);
            } else {
                setError('Failed to update memory');
            }
        } catch (err) {
            setError('Failed to update memory');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto p-4 text-white">Loading...</div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto p-4 text-red-500">{error}</div>
        );
    }

    if (!memory) {
        return (
            <div className="max-w-2xl mx-auto p-4 text-white">
                Memory not found
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <Link
                href={`/memories/${memory.id}`}
                className="inline-flex items-center text-white mb-6 hover:text-gray-300 transition-colors">
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
                Back to Memory
            </Link>

            <div className="bg-black rounded-xl shadow-lg border border-white/10 p-6">
                <h1 className="text-2xl font-bold text-white mb-6">
                    Edit Memory
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-white mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={memory.title}
                            onChange={(e) =>
                                setMemory({
                                    ...memory,
                                    title: e.target.value,
                                })
                            }
                            className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-white/10 focus:border-transparent transition-colors bg-black text-white border ${
                                errors.title
                                    ? 'border-red-500'
                                    : 'border-white/10'
                            }`}
                            placeholder="Give this memory a title"
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-1">
                            Date *
                        </label>
                        <DatePicker
                            selected={
                                memory.date ? new Date(memory.date) : null
                            }
                            onChange={handleDateChange}
                            dateFormat="MMMM d, yyyy"
                            className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-white/10 focus:border-transparent transition-colors bg-black text-white border ${
                                errors.date
                                    ? 'border-red-500'
                                    : 'border-white/10'
                            }`}
                            placeholderText="Select a date"
                            maxDate={new Date()}
                            showYearDropdown
                            scrollableYearDropdown
                            yearDropdownItemNumber={100}
                        />
                        {errors.date && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.date}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="location"
                            className="block text-sm font-medium text-white mb-1">
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            value={memory.location || ''}
                            onChange={(e) =>
                                setMemory({
                                    ...memory,
                                    location: e.target.value,
                                })
                            }
                            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-white/10 focus:border-transparent transition-colors bg-black text-white border border-white/10"
                            placeholder="Where did this happen?"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-white mb-1">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            value={memory.description}
                            onChange={(e) =>
                                setMemory({
                                    ...memory,
                                    description: e.target.value,
                                })
                            }
                            rows={5}
                            className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-white/10 focus:border-transparent transition-colors bg-black text-white border ${
                                errors.description
                                    ? 'border-red-500'
                                    : 'border-white/10'
                            }`}
                            placeholder="Describe this memory..."
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="tags"
                            className="block text-sm font-medium text-white mb-1">
                            Tags
                        </label>
                        <input
                            type="text"
                            id="tags"
                            value={memory.tags?.join(', ') || ''}
                            onChange={(e) =>
                                setMemory({
                                    ...memory,
                                    tags: e.target.value
                                        .split(',')
                                        .map((tag) => tag.trim()),
                                })
                            }
                            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-white/10 focus:border-transparent transition-colors bg-black text-white border border-white/10"
                            placeholder="Add tags separated by commas"
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
                                    <div
                                        key={index}
                                        className="relative h-32 w-32">
                                        <Image
                                            src={url}
                                            alt={`Preview ${index + 1}`}
                                            fill
                                            className="object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">
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
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="w-full px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-colors text-white">
                                    Add Images
                                </button>
                                <p className="mt-1 text-xs text-gray-400">
                                    You can select multiple images
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() =>
                                router.push(`/memories/${memory.id}`)
                            }
                            className="px-4 py-2 text-white hover:text-gray-300 transition-colors"
                            disabled={isSubmitting}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-white hover:bg-gray-200 text-black px-6 py-2 rounded-lg transition-colors disabled:opacity-70 flex items-center"
                            disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-2 border-black mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
