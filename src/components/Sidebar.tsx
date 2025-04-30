'use client';

import Link from 'next/link';
import { FaTasks, FaMemory } from 'react-icons/fa';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    return (
        <div
            className={`fixed top-16 right-0 h-full bg-black shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
            <div className="w-80 h-full p-4 overflow-y-auto border-l border-white/10">
                <div className="flex flex-col space-y-4">
                    <Link
                        href="/todos"
                        onClick={onClose}
                        className="flex items-center p-4 text-white hover:bg-white/10 rounded-lg transition-colors">
                        <FaTasks className="mr-3 w-6 h-6" />
                        <span className="text-lg">Todos</span>
                    </Link>

                    <Link
                        href="/memories"
                        onClick={onClose}
                        className="flex items-center p-4 text-white hover:bg-white/10 rounded-lg transition-colors">
                        <FaMemory className="mr-3 w-6 h-6" />
                        <span className="text-lg">Memories</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
