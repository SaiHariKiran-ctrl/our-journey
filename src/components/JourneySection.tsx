// src/components/JourneySection.tsx
'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

interface JourneySectionProps {
  title: string;
  content: string;
  imageUrl: string;
  backgroundColor: string;
  isEven: boolean;
}

export default function JourneySection({
  title,
  content,
  imageUrl,
  backgroundColor,
  isEven,
}: JourneySectionProps) {
  // Use intersection observer to trigger animations when section is in view
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
        duration: 0.8 
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const imageVariants = {
    hidden: { 
      opacity: 0,
      x: isEven ? -100 : 100,
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 1, ease: "easeOut", delay: 0.2 }
    }
  };

  return (
    <section
      ref={ref}
      className={`${backgroundColor} min-h-screen flex items-center py-16 px-4 md:px-8`}
    >
      <motion.div 
        className="container mx-auto grid md:grid-cols-2 gap-8 items-center"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {/* Image section */}
        <motion.div 
          className={`${isEven ? 'md:order-1' : 'md:order-2'}`}
          variants={imageVariants}
        >
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-xl">
            {/* This is a placeholder - replace with actual images */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center">
              <span className="text-6xl">📸</span>
              <span className="absolute bottom-4 right-4 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                Replace with: {imageUrl}
              </span>
            </div>
          </div>
        </motion.div>
        
        {/* Text section */}
        <motion.div className={`${isEven ? 'md:order-2' : 'md:order-1'} space-y-6`}>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-purple-700" 
            variants={itemVariants}
          >
            {title}
          </motion.h2>
          
          <motion.p 
            className="text-lg text-purple-600"
            variants={itemVariants}
          >
            {content}
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <div className="h-1 w-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}