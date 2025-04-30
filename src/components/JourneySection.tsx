// src/components/JourneySection.tsx
'use client';

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

  const gradientBackgrounds = [
    'bg-gradient-to-br from-pink-400/20 via-purple-400/20 to-blue-400/20',
    'bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-red-400/20',
    'bg-gradient-to-br from-green-400/20 via-teal-400/20 to-blue-400/20',
    'bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-red-400/20',
    'bg-gradient-to-br from-blue-400/20 via-indigo-400/20 to-purple-400/20',
  ];

  return (
    <section
      ref={ref}
      className={`${gradientBackgrounds[Math.floor(Math.random() * gradientBackgrounds.length)]} p-8 md:p-12 rounded-xl backdrop-blur-sm`}
    >
      <motion.div 
        className={`container mx-auto grid ${imageUrl ? 'md:grid-cols-2' : ''} gap-8 items-center`}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >

        {imageUrl && <motion.div
          className={`${isEven ? 'md:order-1' : 'md:order-2'} group`}
          variants={imageVariants}
        >
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <span className="text-white text-sm font-medium">✨ {title}</span>
            </div>
          </div>
        </motion.div>
        }
        
        {/* Text section */}
        <motion.div className={`${isEven ? 'md:order-2' : 'md:order-1'} space-y-6`}>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500" 
            variants={itemVariants}
          >
            {title}
          </motion.h2>
          
          <motion.p 
            className="text-lg text-white leading-relaxed"
            variants={itemVariants}
          >
            {content}
          </motion.p>
          
          <motion.div 
            className="flex items-center gap-2"
            variants={itemVariants}
          >
            <div className="h-1 w-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
            <span className="text-pink-400">❤️</span>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}