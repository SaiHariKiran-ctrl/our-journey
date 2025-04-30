'use client';

import { useState, useEffect } from 'react';
import { events, isEventToday } from '../lib/events';
import { Memory, Todo } from '../lib/types';
import {
    getMemories,
    getTodos,
    updateTodo,
    deleteTodo as deleteTodoFromDb,
} from '../lib/db';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const truncateText = (text: string, maxWords: number) => {
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
};

// Skeleton Components
const MemorySkeleton = () => (
    <div className="glass-effect rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="relative h-40 sm:h-48 w-full bg-gray-700 animate-pulse" />
        <div className="p-4 sm:p-6">
            <div className="h-6 w-3/4 bg-gray-700 rounded animate-pulse mb-2" />
            <div className="h-4 w-1/2 bg-gray-700 rounded animate-pulse mb-2" />
            <div className="h-4 w-full bg-gray-700 rounded animate-pulse" />
        </div>
    </div>
);

const TodoSkeleton = () => (
    <tr className="border-t border-white/10">
        <td className="p-3 sm:p-4">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-gray-700 animate-pulse" />
        </td>
        <td className="p-3 sm:p-4">
            <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
        </td>
        <td className="p-3 sm:p-4">
            <div className="h-4 w-48 bg-gray-700 rounded animate-pulse" />
        </td>
        <td className="p-3 sm:p-4">
            <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
        </td>
        <td className="p-3 sm:p-4">
            <div className="flex gap-2">
                <div className="h-4 w-12 bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-12 bg-gray-700 rounded animate-pulse" />
            </div>
        </td>
    </tr>
);

const TimeCounterSkeleton = () => (
    <div className="text-center p-3 sm:p-4 rounded-xl bg-white/10">
        <div className="h-8 w-12 bg-gray-700 rounded animate-pulse mb-1 sm:mb-2" />
        <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
    </div>
);

export default function Home() {
    const todayEvents = events.filter((event) => isEventToday(event.date));
    const mainEvent = todayEvents[0];
    const [displayedMemories, setDisplayedMemories] = useState(3);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [memories, setMemories] = useState<Memory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [timeTogether, setTimeTogether] = useState({
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 0,
        months: 0,
        years: 0,
    });
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fetchedMemories, fetchedTodos] = await Promise.all([
                    getMemories(),
                    getTodos(),
                ]);
                setMemories(fetchedMemories);
                setTodos(fetchedTodos);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const startDate = new Date('2025-03-20');

        const calculateTimeTogether = () => {
            const now = new Date();
            const diff = now.getTime() - startDate.getTime();

            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            const months = Math.floor(days / 30.44);
            const years = Math.floor(months / 12);

            setTimeTogether({
                seconds: seconds % 60,
                minutes: minutes % 60,
                hours: hours % 24,
                days: days % 30,
                months: months % 12,
                years: years,
            });
        };

        calculateTimeTogether();

        const interval = setInterval(calculateTimeTogether, 1000);

        return () => clearInterval(interval);
    }, []);

    const latestTodos = [...todos]
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
        .slice(0, 5);

    const latestMemories = [...memories]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .filter((memory) => memory.isHighlighted)
        .slice(0, displayedMemories);

    const recentMemories = [...memories]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    const toggleTodo = async (id: string) => {
        const todoToUpdate = todos.find((todo) => todo.id === id);
        if (!todoToUpdate) return;

        const updatedTodo = {
            ...todoToUpdate,
            isCompleted: !todoToUpdate.isCompleted,
        };

        try {
            const result = await updateTodo(id, {
                title: updatedTodo.title,
                description: updatedTodo.description,
                isCompleted: updatedTodo.isCompleted,
                dueDate: updatedTodo.dueDate,
                priority: updatedTodo.priority,
                tags: updatedTodo.tags,
            });

            if (result) {
                setTodos(todos.map((todo) => (todo.id === id ? result : todo)));
            }
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const deleteTodo = async (id: string) => {
        try {
            await deleteTodoFromDb(id);
            setTodos(todos.filter((todo) => todo.id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const loadMoreMemories = () => {
        setDisplayedMemories((prev) => prev + 3);
    };

    const handleMemoryClick = (memoryId: string) => {
        router.push(`/memories/${memoryId}`);
    };

    // Filter out completed todos
    const activeTodos = todos
        .filter((todo) => !todo.isCompleted)
        .sort(
            (a, b) =>
                new Date(a.dueDate || '').getTime() -
                new Date(b.dueDate || '').getTime()
        )
        .slice(0, 5);

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {isLoading ? (
                    <>
                        <div className="hero rounded-2xl my-4 sm:my-6 md:my-8 backdrop-blur-md p-4 sm:p-6 md:p-8">
                            <div className="mb-6 sm:mb-8 md:mb-12">
                                <div className="h-12 w-3/4 bg-gray-700 rounded animate-pulse mb-4 sm:mb-6" />
                                <div className="h-6 w-1/2 bg-gray-700 rounded animate-pulse" />
                            </div>
                        </div>

                        <div className="glass-effect rounded-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 backdrop-blur-md">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6">
                                Our Journey
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
                                {[...Array(6)].map((_, i) => (
                                    <TimeCounterSkeleton key={i} />
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 sm:mt-12 md:mt-16">
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">
                                Highlighted Memories
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                                {[...Array(3)].map((_, i) => (
                                    <MemorySkeleton key={i} />
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 sm:mt-12 md:mt-16">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                                <h2 className="text-xl sm:text-2xl font-bold text-white">
                                    Latest Todos
                                </h2>
                            </div>
                            <div className="glass-effect rounded-xl overflow-hidden">
                                <div className="responsive-table-container">
                                    <table className="responsive-table w-full">
                                        <thead>
                                            <tr className="bg-white/10">
                                                <th className="p-3 sm:p-4 text-left">
                                                    Status
                                                </th>
                                                <th className="p-3 sm:p-4 text-left">
                                                    Title
                                                </th>
                                                <th className="p-3 sm:p-4 text-left">
                                                    Description
                                                </th>
                                                <th className="p-3 sm:p-4 text-left">
                                                    Due Date
                                                </th>
                                                <th className="p-3 sm:p-4 text-left">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[...Array(5)].map((_, i) => (
                                                <TodoSkeleton key={i} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {todayEvents.length > 0 ? (
                            <div className="hero rounded-2xl my-4 sm:my-6 md:my-8 backdrop-blur-md p-4 sm:p-6 md:p-8">
                                <>
                                    <div className="mb-6 sm:mb-8 md:mb-12">
                                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6">
                                            {mainEvent.title}
                                        </h1>
                                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-secondary">
                                            {mainEvent.description}
                                        </p>
                                    </div>

                                    {todayEvents.length > 1 && (
                                        <div className="mb-6 sm:mb-8 md:mb-12">
                                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">
                                                Today&apos;s Events
                                            </h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {todayEvents
                                                    .slice(1)
                                                    .map((event) => (
                                                        <div
                                                            key={event.id}
                                                            className="glass-effect p-4 sm:p-6 rounded-xl backdrop-blur-sm">
                                                            <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                                                                <span className="text-2xl sm:text-3xl">
                                                                    {event.type ===
                                                                    'birthday'
                                                                        ? '🎂'
                                                                        : event.type ===
                                                                          'anniversary'
                                                                        ? '💑'
                                                                        : '🎉'}
                                                                </span>
                                                                <h3 className="text-lg sm:text-xl font-bold text-white">
                                                                    {
                                                                        event.title
                                                                    }
                                                                </h3>
                                                            </div>
                                                            <p className="text-text-secondary mb-2">
                                                                {new Date(
                                                                    event.date
                                                                ).toLocaleDateString()}
                                                            </p>
                                                            {event.description && (
                                                                <p className="text-text-secondary text-sm sm:text-base">
                                                                    {
                                                                        event.description
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            </div>
                        ) : (
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6"></h1>
                        )}

                        <div className="glass-effect rounded-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 backdrop-blur-md">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6">
                                Our Journey
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
                                <div className="text-center p-3 sm:p-4 rounded-xl bg-white/10">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
                                        {timeTogether.years}
                                    </div>
                                    <div className="text-text-secondary text-xs sm:text-sm">
                                        Years
                                    </div>
                                </div>
                                <div className="text-center p-3 sm:p-4 rounded-xl bg-white/10">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
                                        {timeTogether.months}
                                    </div>
                                    <div className="text-text-secondary text-xs sm:text-sm">
                                        Months
                                    </div>
                                </div>
                                <div className="text-center p-3 sm:p-4 rounded-xl bg-white/10">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
                                        {timeTogether.days}
                                    </div>
                                    <div className="text-text-secondary text-xs sm:text-sm">
                                        Days
                                    </div>
                                </div>
                                <div className="text-center p-3 sm:p-4 rounded-xl bg-white/10">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
                                        {timeTogether.hours}
                                    </div>
                                    <div className="text-text-secondary text-xs sm:text-sm">
                                        Hours
                                    </div>
                                </div>
                                <div className="text-center p-3 sm:p-4 rounded-xl bg-white/10">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
                                        {timeTogether.minutes}
                                    </div>
                                    <div className="text-text-secondary text-xs sm:text-sm">
                                        Minutes
                                    </div>
                                </div>
                                <div className="text-center p-3 sm:p-4 rounded-xl bg-white/10">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
                                        {timeTogether.seconds}
                                    </div>
                                    <div className="text-text-secondary text-xs sm:text-sm">
                                        Seconds
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 sm:mt-12 md:mt-16">
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">
                                Highlighted Memories
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                                {latestMemories.map((memory) => (
                                    <div
                                        key={memory.id}
                                        className="glass-effect rounded-xl overflow-hidden backdrop-blur-sm">
                                        {memory.imageUrls &&
                                            memory.imageUrls[0] && (
                                                <div className="relative h-40 sm:h-48 w-full group">
                                                    <Image
                                                        src={
                                                            memory.imageUrls[0]
                                                        }
                                                        alt={memory.title}
                                                        fill
                                                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </div>
                                            )}
                                        <div className="p-4 sm:p-6">
                                            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">
                                                {memory.title}
                                            </h3>
                                            <p className="text-text-secondary mb-2">
                                                {new Date(
                                                    memory.date
                                                ).toLocaleDateString()}
                                            </p>
                                            <p className="text-text-secondary line-clamp-2">
                                                {memory.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 sm:mt-12 md:mt-16">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                                <h2 className="text-xl sm:text-2xl font-bold text-white">
                                    Latest Todos
                                </h2>
                                <Link
                                    href="/todos"
                                    className="text-primary hover:text-primary-dark">
                                    View All Todos →
                                </Link>
                            </div>

                            <div className="glass-effect rounded-xl overflow-hidden">
                                <div className="responsive-table-container">
                                    <table className="responsive-table w-full">
                                        <thead>
                                            <tr className="bg-white/10">
                                                <th className="p-3 sm:p-4 text-left">
                                                    Status
                                                </th>
                                                <th className="p-3 sm:p-4 text-left">
                                                    Title
                                                </th>
                                                <th className="p-3 sm:p-4 text-left">
                                                    Description
                                                </th>
                                                <th className="p-3 sm:p-4 text-left">
                                                    Due Date
                                                </th>
                                                <th className="p-3 sm:p-4 text-left">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activeTodos.map((todo) => (
                                                <tr
                                                    key={todo.id}
                                                    className="border-t border-white/10 hover:bg-white/5 transition-colors">
                                                    <td className="p-3 sm:p-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                todo.isCompleted
                                                            }
                                                            onChange={() =>
                                                                toggleTodo(
                                                                    todo.id
                                                                )
                                                            }
                                                            className="w-4 h-4 sm:w-5 sm:h-5 rounded cursor-pointer accent-primary"
                                                        />
                                                    </td>
                                                    <td className="p-3 sm:p-4">
                                                        <span
                                                            className={
                                                                todo.isCompleted
                                                                    ? 'line-through text-text-secondary'
                                                                    : 'text-white'
                                                            }>
                                                            {todo.title}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 sm:p-4">
                                                        <span
                                                            className={
                                                                todo.isCompleted
                                                                    ? 'line-through text-text-secondary'
                                                                    : 'text-text-secondary'
                                                            }>
                                                            {todo.description}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 sm:p-4">
                                                        {todo.dueDate && (
                                                            <span
                                                                className={
                                                                    new Date(
                                                                        todo.dueDate
                                                                    ) <
                                                                    new Date()
                                                                        ? 'text-red-500'
                                                                        : 'text-text-secondary'
                                                                }>
                                                                {new Date(
                                                                    todo.dueDate
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-3 sm:p-4">
                                                        <div className="flex gap-2 sm:gap-3">
                                                            <Link
                                                                href={`/todos/${todo.id}/edit`}
                                                                className="text-blue-500 hover:text-blue-700 transition-colors text-sm sm:text-base">
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() =>
                                                                    deleteTodo(
                                                                        todo.id
                                                                    )
                                                                }
                                                                className="text-red-500 hover:text-red-700 transition-colors text-sm sm:text-base">
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 sm:mt-12 md:mt-16">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                                <h2 className="text-xl sm:text-2xl font-bold text-white">
                                    Latest Memories
                                </h2>
                                <Link
                                    href="/memories"
                                    className="text-primary hover:text-primary-dark">
                                    View All Memories →
                                </Link>
                            </div>

                            <div className="glass-effect rounded-xl overflow-hidden">
                                <div className="responsive-table-container">
                                    <table className="responsive-table w-full">
                                        <thead>
                                            <tr className="bg-white/10">
                                                <th className="p-3 sm:p-4 text-left">
                                                    Image
                                                </th>
                                                <th className="p-3 sm:p-4 text-left">
                                                    Title
                                                </th>
                                                <th className="p-3 sm:p-4 text-left">
                                                    Date
                                                </th>
                                                <th className="p-3 sm:p-4 text-left">
                                                    Description
                                                </th>
                                                <th className="p-3 sm:p-4 text-left">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentMemories.map((memory) => (
                                                <tr
                                                    key={memory.id}
                                                    onClick={() =>
                                                        handleMemoryClick(
                                                            memory.id
                                                        )
                                                    }
                                                    className="border-t border-white/10 hover:bg-white/5 cursor-pointer transition-colors duration-200">
                                                    <td className="p-3 sm:p-4">
                                                        {memory.imageUrls &&
                                                            memory
                                                                .imageUrls[0] && (
                                                                <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                                                                    <Image
                                                                        src={
                                                                            memory
                                                                                .imageUrls[0]
                                                                        }
                                                                        alt={
                                                                            memory.title
                                                                        }
                                                                        fill
                                                                        className="object-cover rounded-lg"
                                                                    />
                                                                </div>
                                                            )}
                                                    </td>
                                                    <td className="p-3 sm:p-4">
                                                        <span className="font-medium text-sm sm:text-base">
                                                            {memory.title}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 sm:p-4">
                                                        <span className="text-sm sm:text-base">
                                                            {new Date(
                                                                memory.date
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 sm:p-4">
                                                        <span className="text-text-secondary text-sm sm:text-base">
                                                            {truncateText(
                                                                memory.description,
                                                                20
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 sm:p-4">
                                                        <Link
                                                            href={`/memories/${memory.id}`}
                                                            className="text-primary hover:text-primary-dark text-sm sm:text-base"
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }>
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
