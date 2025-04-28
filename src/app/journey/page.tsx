// src/app/journey/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import JourneySection from '@/components/JourneySection';

export default function JourneyPage() {
  const router = useRouter();
  
  // Define your journey sections - update with your actual content
  const journeySections = [
    {
      id: 'first-meeting',
      title: 'When We First Met',
      content: 'I still remember the first time I saw you. There was something special about your smile that caught my attention immediately.',
      imageUrl: '/images/first-meeting.jpg', // You'll need to add these images
      backgroundColor: 'bg-pink-100',
    },
    {
      id: 'first-date',
      title: 'Our First Date',
      content: 'Remember that little café where we spent hours talking? I knew then that there was something special between us.',
      imageUrl: '/images/first-date.jpg',
      backgroundColor: 'bg-purple-100',
    },
    {
      id: 'special-moments',
      title: 'Special Moments',
      content: 'From our first trip together to that time we got caught in the rain, every moment with you has been an adventure.',
      imageUrl: '/images/special-moments.jpg',
      backgroundColor: 'bg-blue-100',
    },
    {
      id: 'growing-together',
      title: 'Growing Together',
      content: 'Through challenges and celebrations, we&apos;ve grown together. I&apos;ve loved watching us become better versions of ourselves.',
      imageUrl: '/images/growing.jpg',
      backgroundColor: 'bg-green-100',
    },
    {
      id: 'today',
      title: 'Today and Beyond',
      content: 'And now here we are, still growing, still learning, and still falling more in love every day.',
      imageUrl: '/images/today.jpg',
      backgroundColor: 'bg-yellow-100',
    },
  ];

  // After all sections are viewed, redirect to Memory Box
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // If user has scrolled to the bottom of the page
      if (scrollPosition >= documentHeight - 100) {
        const timer = setTimeout(() => {
          router.push('/memories');
        }, 2000); // Delay before redirecting
        
        return () => clearTimeout(timer);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [router]);

  return (
    <div className="journey-container">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-purple-700 mb-4">Our Journey Together</h1>
        <p className="text-lg text-purple-600 mb-8">Scroll down to experience our story...</p>
      </div>
      
      {journeySections.map((section, index) => (
        <JourneySection
          key={section.id}
          title={section.title}
          content={section.content}
          imageUrl={section.imageUrl}
          backgroundColor={section.backgroundColor}
          isEven={index % 2 === 0}
        />
      ))}
      
      <div className="text-center py-12 bg-gradient-to-b from-transparent to-pink-100 mt-16">
        <h2 className="text-3xl font-bold text-purple-700 mb-4">The End... For Now</h2>
        <p className="text-lg text-purple-600">
          Our journey continues! Let&apos;s check out our Memory Box next...
        </p>
      </div>
    </div>
  );
}