'use client';

import React, { useState, useEffect } from 'react';
import { Heart, ChevronDown } from 'lucide-react';
import { lucySaidOk } from '../fonts';

const JourneyPage = () => {
    const [visibleIndex, setVisibleIndex] = useState(0);
    const [showHeart, setShowHeart] = useState(false);
    const [showScrollIndicator, setShowScrollIndicator] = useState(true);
    const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>(
        'down'
    );
    const [showBackLink, setShowBackLink] = useState(false);

    const messages = [
        'Like everyone, I had an ideal type in my mind, the kind of partner I always dreamed of. ',
        "But I had convinced myself that someone like that doesn't really exist.",
        'And then I met her. She proved me wrong.',
        "It didn't take me long to fall in love with her. Because deep down, I already knew she is the one.",
        'What makes it even more special is that she felt the same way too.',
        'To be honest, I am not perfect',
        'but I promise to give her my best every single day to keep her happy, healthy, and loved.',
        'I may not be able to care for her like her parents do, ',
        'but I will care for her like I would for my own daughter with everything I have.',
        'She is amazing.',
        'She is beautiful.',
        'She is everything I asked for.',
        'She is my home.',
        'And today is her birthday, our first one together.',
        'I wish she gets everything she ever wished for.',
        'I hope she smiles more, laughs louder, and lives a life full of happiness.',
        'I want to see her celebrate many more birthdays with me, by her side.',
        'And I hope we grow old together, sharing happiness for a lifetime.',
        'Happy Birthday, bangaram.',
    ];

    useEffect(() => {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    const viewportHeight = window.innerHeight;
                    const documentHeight = document.body.scrollHeight;

                    // Update scroll direction
                    if (currentScrollY > lastScrollY) {
                        setScrollDirection('down');
                    } else if (currentScrollY < lastScrollY) {
                        setScrollDirection('up');
                    }
                    lastScrollY = currentScrollY;

                    // Hide scroll indicator
                    if (currentScrollY > 10 && showScrollIndicator) {
                        setShowScrollIndicator(false);
                    }

                    // Calculate message index
                    const messageHeight = viewportHeight * 1.5;
                    const totalScrollHeight = messageHeight * messages.length;
                    const scrollProgress = Math.min(
                        Math.max(
                            currentScrollY /
                                (totalScrollHeight - viewportHeight),
                            0
                        ),
                        1
                    );

                    const newIndex = Math.min(
                        Math.floor(scrollProgress * messages.length),
                        messages.length - 1
                    );

                    if (newIndex !== visibleIndex) {
                        setVisibleIndex(newIndex);
                    }

                    // Show heart on last message
                    if (newIndex === messages.length - 1) {
                        setShowHeart(true);
                        setShowBackLink(true);
                    } else {
                        setShowHeart(false);
                        setShowBackLink(false);
                    }

                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [messages.length, showScrollIndicator, visibleIndex]);

    // Particle effect component
    const Particles = () => {
        const particleCount = 50;
        const particles = Array.from({ length: particleCount }).map((_, i) => {
            const left = `${Math.random() * 100}%`;
            const animationDuration = `${5 + Math.random() * 10}s`;
            const delay = `${Math.random() * 5}s`;
            const size = `${0.5 + Math.random() * 0.5}rem`;
            const opacity = Math.random() * 0.7 + 0.3;

            return (
                <div
                    key={i}
                    className="absolute rounded-full bg-pink-300"
                    style={{
                        left,
                        top: '-5%',
                        width: size,
                        height: size,
                        opacity,
                        animation: `fall ${animationDuration} linear ${delay} infinite`,
                    }}
                />
            );
        });

        return <>{particles}</>;
    };

    return (
        <div
            className={`relative min-h-screen ${lucySaidOk.variable} font-lucy`}
            style={{}}>
            <style>
                {`
                    @keyframes fall {
                        0% { transform: translateY(-10px); opacity: 0; }
                        10% { opacity: 1; }
                        100% { transform: translateY(100vh); opacity: 0; }
                    }
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes fadeOut {
                        from { opacity: 1; transform: translateY(0); }
                        to { opacity: 0; transform: translateY(-20px); }
                    }
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(-20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes fadeOutUp {
                        from { opacity: 1; transform: translateY(0); }
                        to { opacity: 0; transform: translateY(20px); }
                    }
                    @keyframes bounce {
                        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                        40% { transform: translateY(-20px); }
                        60% { transform: translateY(-10px); }
                    }
                    html {
                        scroll-behavior: smooth;
                        height: 100%;
                    }
                    body {
                        height: 100%;
                        overflow-y: scroll;
                        overflow-x: hidden;
                    }
                    .font-lucy {
                        font-family: var(--font-lucy), cursive;
                    }
                `}
            </style>

            <Particles />

            <div className="h-screen fixed top-0 left-0 right-0 flex items-center justify-center">
                <div className="max-w-md mx-auto px-4 text-center">
                    {messages.map((msg, index) => (
                        <p
                            key={index}
                            className="absolute left-0 right-0 px-8 text-2xl md:text-4xl text-white transition-all duration-1000 font-lucy font-normal"
                            style={{
                                opacity: index === visibleIndex ? 1 : 0,
                                animation:
                                    index === visibleIndex
                                        ? scrollDirection === 'down'
                                            ? 'fadeIn 1s ease-in-out'
                                            : 'fadeInUp 1s ease-in-out'
                                        : index === visibleIndex - 1 &&
                                          scrollDirection === 'down'
                                        ? 'fadeOut 1s ease-in-out'
                                        : index === visibleIndex + 1 &&
                                          scrollDirection === 'up'
                                        ? 'fadeOutUp 1s ease-in-out'
                                        : 'none',
                                zIndex: index === visibleIndex ? 10 : 1,
                                pointerEvents: 'none',
                            }}>
                            {msg}
                        </p>
                    ))}
                    {showBackLink && (
                        <a
                            href="/"
                            className="absolute bottom-72 left-0 right-0 text-white text-xl font-lucy hover:text-pink-300 transition-colors duration-300"
                            style={{
                                opacity: showBackLink ? 1 : 0,
                                animation: 'fadeIn 1s ease-in-out',
                                zIndex: 20,
                            }}>
                            ← Back to Home Page
                        </a>
                    )}
                </div>
            </div>

            {showScrollIndicator && (
                <div
                    className="fixed bottom-10 left-0 right-0 flex flex-col items-center justify-center transition-opacity duration-500 z-30"
                    style={{ animation: 'pulse 2s infinite' }}>
                    <p className="text-gray-600 mb-2 font-lucy">Scroll Down</p>
                    <ChevronDown
                        size={32}
                        color="#718096"
                        className="animate-bounce"
                    />
                </div>
            )}

            <div style={{ height: `${messages.length * 150}vh` }}></div>
        </div>
    );
};

export default JourneyPage;
