'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import Link from 'next/link';
import type { Metadata } from 'next';
import SessionProvider from '../components/SessionProvider';
import { useSession, signOut } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

// export const metadata = {
//   title: 'Our Journey Together',
//   description: 'A special website dedicated to our journey and memories',
// };

function Header() {
    const { data: session, status } = useSession();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    return (
        <header className="fixed w-full h-16 top-0 left-0 z-50 bg-black border-b border-white/10 dark:border-white/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                <Link
                    href="/"
                    className="text-xl sm:text-2xl font-bold hover:text-primary transition-colors">
                    Our Journey
                </Link>
                <div className="flex items-center gap-4">
                    {status === 'authenticated' && (
                        <button
                            onClick={handleLogout}
                            className="text-sm sm:text-base text-white hover:text-primary transition-colors">
                            Logout
                        </button>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                        <FaBars className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>
            </div>
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
        </header>
    );
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="scroll-smooth">
            <head>
                <style>
                    {`
                        .responsive-table-container {
                            width: 100%;
                            overflow-x: auto;
                            -webkit-overflow-scrolling: touch;
                            scrollbar-width: thin;
                        }
                        .responsive-table-container::-webkit-scrollbar {
                            height: 6px;
                        }
                        .responsive-table-container::-webkit-scrollbar-track {
                            background: rgba(255, 255, 255, 0.1);
                        }
                        .responsive-table-container::-webkit-scrollbar-thumb {
                            background: rgba(255, 255, 255, 0.2);
                            border-radius: 3px;
                        }
                        .responsive-table-container::-webkit-scrollbar-thumb:hover {
                            background: rgba(255, 255, 255, 0.3);
                        }
                        @media (max-width: 640px) {
                            .responsive-table {
                                min-width: 800px;
                            }
                        }
                    `}
                </style>
            </head>
            <body className={`${inter.className} min-h-screen flex flex-col`}>
                <SessionProvider>
                    <Header />
                    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16">
                        {children}
                    </main>
                    <footer className="glass-effect border-t border-white/10 dark:border-black/10 py-4 sm:py-6">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <p className="text-white font-medium">M ❤️ K</p>
                        </div>
                    </footer>
                </SessionProvider>
            </body>
        </html>
    );
}
