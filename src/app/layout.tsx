'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

// export const metadata = {
//   title: 'Our Journey Together',
//   description: 'A special website dedicated to our journey and memories',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <header className="sticky h-16 top-0 z-30 bg-black border-b border-white/10 dark:border-white/10">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold hover:text-primary transition-colors">Our Journey</Link>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <FaBars className="w-6 h-6" />
            </button>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="glass-effect border-t border-white/10 dark:border-black/10 py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-white font-medium">Made with ❤️ for you</p>
          </div>
        </footer>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </body>
    </html>
  );
}