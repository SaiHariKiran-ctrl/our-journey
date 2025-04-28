'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Journey of Us', path: '/journey' },
    { label: 'Memory Box', path: '/memories' },
  ];

  return (
    <>
      <nav className="bg-purple-600">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  className={`block py-2 px-4 transition-colors duration-200 
                    ${pathname === item.path 
                      ? 'bg-white text-purple-600 font-medium rounded-t-lg' 
                      : 'text-white hover:bg-purple-500'}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <Sidebar />
    </>
  );
}