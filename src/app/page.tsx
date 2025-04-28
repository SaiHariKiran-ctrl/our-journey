'use client';

import { useState, useEffect } from 'react';
import { events, isEventToday } from '@/lib/events';
import { memories } from '@/lib/memories';
import { todos as initialTodos } from '@/lib/todos';
import { Todo } from '@/lib/todos';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const todayEvents = events.filter(event => isEventToday(event.date));
  const mainEvent = todayEvents[0];
  const [displayedMemories, setDisplayedMemories] = useState(3);
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [timeTogether, setTimeTogether] = useState({
    seconds: 0,
    minutes: 0,
    hours: 0,
    days: 0,
    months: 0,
    years: 0
  });

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
        years: years
      });
    };

    calculateTimeTogether();
    
    const interval = setInterval(calculateTimeTogether, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const latestTodos = [...todos]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const latestMemories = [...memories]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, displayedMemories);

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const loadMoreMemories = () => {
    setDisplayedMemories(prev => prev + 3);
  };

  return (
    <div className="min-h-screen">
      <div className="hero rounded-2xl my-8 backdrop-blur-md">
        {todayEvents.length > 0 ? (
          <>
            <div className="mb-12">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                {mainEvent.title}
              </h1>
              <p className="text-xl md:text-2xl text-secondary">
                {mainEvent.description}
              </p>
            </div>

            {todayEvents.length > 1 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Today&apos;s Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {todayEvents.slice(1).map((event) => (
                    <div key={event.id} className="glass-effect p-6 rounded-xl backdrop-blur-sm">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-3xl">
                          {event.type === 'birthday' ? '🎂' : event.type === 'anniversary' ? '💑' : '🎉'}
                        </span>
                        <h3 className="text-xl font-bold text-white">{event.title}</h3>
                      </div>
                      <p className="text-text-secondary mb-2">{new Date(event.date).toLocaleDateString()}</p>
                      {event.description && (
                        <p className="text-text-secondary">{event.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          </h1>
        )}
      </div>

      <div className="glass-effect rounded-2xl p-8 mb-8 backdrop-blur-md">
        <h2 className="text-3xl font-bold text-white mb-6">Our Journey</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center p-4 rounded-xl bg-white/10">
            <div className="text-4xl font-bold text-white mb-2">{timeTogether.seconds}</div>
            <div className="text-text-secondary text-sm">Seconds</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/10">
            <div className="text-4xl font-bold text-white mb-2">{timeTogether.minutes}</div>
            <div className="text-text-secondary text-sm">Minutes</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/10">
            <div className="text-4xl font-bold text-white mb-2">{timeTogether.hours}</div>
            <div className="text-text-secondary text-sm">Hours</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/10">
            <div className="text-4xl font-bold text-white mb-2">{timeTogether.days}</div>
            <div className="text-text-secondary text-sm">Days</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/10">
            <div className="text-4xl font-bold text-white mb-2">{timeTogether.months}</div>
            <div className="text-text-secondary text-sm">Months</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/10">
            <div className="text-4xl font-bold text-white mb-2">{timeTogether.years}</div>
            <div className="text-text-secondary text-sm">Years</div>
          </div>
        </div>
      </div>

      {memories.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8">Highlighted Memories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestMemories.slice(0, displayedMemories).map((memory) => (
              <div key={memory.id} className="glass-effect rounded-xl overflow-hidden backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                {memory.imageUrl && (
                  <div className="relative h-48 w-full group">
                    <Image
                      src={memory.imageUrl}
                      alt={memory.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">{memory.title}</h3>
                  <p className="text-text-secondary mb-2">{new Date(memory.date).toLocaleDateString()}</p>
                  <p className="text-text-secondary line-clamp-2">{memory.description}</p>
                </div>
              </div>
            ))}
          </div>
          {memories.length > displayedMemories && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMoreMemories}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                See More Memories
              </button>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">To Do List</h2>
          <Link href="/todos" className="text-primary hover:text-primary-dark">
            View All Tasks →
          </Link>
        </div>

        <div className="glass-effect rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-white/10">
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Due Date</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {latestTodos.map((todo) => (
                <tr key={todo.id} className="border-t border-white/10">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={todo.isCompleted}
                      onChange={() => toggleTodo(todo.id)}
                      className="w-5 h-5 rounded"
                    />
                  </td>
                  <td className="p-4">
                    <span className={todo.isCompleted ? 'line-through text-text-secondary' : ''}>
                      {todo.title}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={todo.isCompleted ? 'line-through text-text-secondary' : ''}>
                      {todo.description}
                    </span>
                  </td>
                  <td className="p-4">
                    {todo.dueDate && new Date(todo.dueDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Latest Memories</h2>
          <Link href="/memories" className="text-primary hover:text-primary-dark">
            View All Memories →
          </Link>
        </div>

        <div className="glass-effect rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-white/10">
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {latestMemories.map((memory) => (
                <tr key={memory.id} className="border-t border-white/10">
                  <td className="p-4">
                    {memory.imageUrl && (
                      <div className="relative w-16 h-16">
                        <Image
                          src={memory.imageUrl}
                          alt={memory.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="font-medium">{memory.title}</span>
                  </td>
                  <td className="p-4">
                    {new Date(memory.date).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className="text-text-secondary">{memory.description}</span>
                  </td>
                  <td className="p-4">
                    <button className="text-primary hover:text-primary-dark mr-4">
                      Edit
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}